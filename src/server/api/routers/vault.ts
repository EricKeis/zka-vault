import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const vaultRouter = createTRPCRouter({
  createVault: publicProcedure
    .mutation(() => {      
      return {
        test: "testing the data",
      };
    }),
});
