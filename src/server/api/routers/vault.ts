import { z } from "zod";
import crypto from 'crypto';
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import type { Vault } from "@prisma/client";
import { getServerSidePasswordHash } from "~/utils/server/cryptoUtils";
import { TRPCError } from "@trpc/server";

export const vaultRouter = createTRPCRouter({
  createVault: protectedProcedure
  .input(z.object({ name: z.string(), data: z.string(), passwordClientSideHash: z.string(), keySalt: z.string(), iv: z.string(), userId: z.string() }))
    .mutation(async ({ctx, input}) => {
      const passwordSalt = crypto.randomBytes(16).toString('base64');
      const passwordServerSideHash = getServerSidePasswordHash(input.passwordClientSideHash, passwordSalt);
      const newVault = await ctx.prisma.user.update({
        where: { id: input.userId },
        data: {
          vaults: {
            create: {
              name: input.name, 
              data: input.data,
              passwordHash: passwordServerSideHash,
              passwordSalt: passwordSalt,
              aes256Iv: input.iv,
              aes256KeySalt: input.keySalt
            }
          }
        }
      })
      console.log(input);

      //, salt: salt.toString('base64'), iv: encryptedData.iv, authtag: encryptedData.tag
      
      return newVault;
    }),
  
  getAllVaultsByUser: protectedProcedure
    .input(z.object({ uid: z.string() }))
    .query(async ({ctx, input}) => {
      const vaults = await ctx.prisma.vault.findMany({
        where: {
          userId: input.uid
        }
      });

      return vaults;
    }),

  getVaultById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ctx, input}) => {
      const vault = await ctx.prisma.vault.findUnique({
        where: {
          id: input.id,
        },
      })

      return {name: vault?.name};
    }),

  getVaultData: protectedProcedure
    .input(z.object({ id: z.string(), passwordClientSideHash: z.string()}))
    .mutation(async ({ctx, input}) => {
      const vault: Vault = await ctx.prisma.vault.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      })
      const passwordServerSideHash = getServerSidePasswordHash(input.passwordClientSideHash, vault.passwordSalt);

      console.log({ old: vault.passwordHash, new: passwordServerSideHash });

      if (passwordServerSideHash !== vault.passwordHash) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
      return vault;

    })
});
