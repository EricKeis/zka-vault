import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const vaultRouter = createTRPCRouter({
  createVault: publicProcedure
    .mutation(async ({ctx}) => {
      const vault = await ctx.prisma.vaultData.create({
        data: {data: "Testing"},
      })
      
      return vault;
    }),
  
  getAll: publicProcedure
    .query(async ({ctx}) => {
      const vaults = await ctx.prisma.vaultData.findMany();

      return vaults;
    }),

  getVaultById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ctx, input}) => {
      const vault = await ctx.prisma.vaultData.findUnique({
        where: {
          id: input.id,
        },
      })

      return vault;
    })
});
