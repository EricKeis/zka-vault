import { z } from "zod";
import crypto from 'crypto';

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { Vault } from "@prisma/client";

function generateKeyFromPassphrase(passphrase: string, salt: Buffer) {
  const iterations = 10000;
  const keyLength = 32; // 256-bit key

  return crypto.pbkdf2Sync(passphrase, salt, iterations, keyLength, 'sha256');
}

export const vaultRouter = createTRPCRouter({
  createVault: publicProcedure
  .input(z.object({ vaultName: z.string(), vaultPassword: z.string(), vaultData: z.string() }))
    .mutation(async ({ctx, input}) => {
      const iv = crypto.randomBytes(12)
      const algorithm = 'aes-256-gcm';

      const salt = crypto.randomBytes(16);
      const key = generateKeyFromPassphrase(input.vaultPassword, salt);
      console.log(key.toString('base64'));

      const cipher = crypto.createCipheriv(algorithm, key, iv);

      let enc = cipher.update(input.vaultData, 'utf8', 'base64');
      enc += cipher.final('base64');

      const encryptedData = { iv: iv.toString('base64'), ciphertext: enc, tag: cipher.getAuthTag().toString('base64') };
      console.log(encryptedData);
      console.log({ salt: salt.toString('base64'), key: key, passphrase: input.vaultPassword })

      const newVault = await ctx.prisma.vault.create({
        data: {name: input.vaultName, data: enc, salt: salt.toString('base64'), iv: encryptedData.iv, authtag: encryptedData.tag},
      })
      console.log(input);
      
      return newVault;
    }),
  
  getAll: publicProcedure
    .query(async ({ctx}) => {
      const vaults = await ctx.prisma.vault.findMany();

      return vaults;
    }),

  getVaultById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ctx, input}) => {
      const vault = await ctx.prisma.vault.findUnique({
        where: {
          id: input.id,
        },
      })

      return {name: vault?.name};
    }),

  getVaultData: publicProcedure
    .input(z.object({ id: z.string(), password: z.string()}))
    .mutation(async ({ctx, input}) => {
      const vault: Vault = await ctx.prisma.vault.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      })

      const iv = Buffer.from(vault.iv, 'base64');
      const algorithm = 'aes-256-gcm';

      const salt = Buffer.from(vault.salt, 'base64');
      const key = generateKeyFromPassphrase(input.password, salt);

      console.log({ iv: iv.toString('base64'), salt: salt.toString('base64'), key: key.toString('base64'), passphrase: input.password })

      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      decipher.setAuthTag(Buffer.from(vault.authtag, 'base64'));
      let str = decipher.update(vault.data, 'base64', 'utf8');
      str += decipher.final('utf8');

      console.log(str)
      return {data: str};

    })
});
