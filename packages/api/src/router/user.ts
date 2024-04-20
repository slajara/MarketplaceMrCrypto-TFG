import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
} from "../web-hooks/user-web-hooks";

//TODO: cambiar algunos publicProcedures a protectedProcedure
export const userRouter = createTRPCRouter({
  ///// ENDPOINT CREATE USER /////
  createUser: publicProcedure
    .input(
      z.object({
        userAddress: z.string(),
        userName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createdUser = await createUser({
        prisma: ctx.prisma,
        userAddress: input.userAddress,
        userName: input.userName,
      });
      console.log(createdUser);
      //TODO: verificar cuando hay error que lo devuelva bien
      if (!createdUser) {
        throw new Error("Problema creando usuario");
      }
      return createdUser;
    }),

  ///// ENDPOINT UPDATE USER /////
  updateUser: publicProcedure
    .input(
      z.object({
        userAddress: z.string(),
        userName: z.string(),
        description: z.string(),
        profileImage: z.string(),
        bannerImage: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await updateUser({
        prisma: ctx.prisma,
        userAddress: input.userAddress,
        userName: input.userName,
        description: input.description,
        profileImage: input.profileImage,
        bannerImage: input.bannerImage,
      });
      return updatedUser;
    }),

  ///// ENDPOINT DELETE USER /////
  deleteUser: publicProcedure
    .input(
      z.object({
        userAddress: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deletedUser = await deleteUser({
        prisma: ctx.prisma,
        userAddress: input.userAddress,
      });
      return deletedUser;
    }),

  ///// ENDPOINT GET USER /////
  getUser: publicProcedure
    .meta({
      openapi: { method: "GET", path: "/user/{userAddress}", tags: ["user"] },
    })
    .input(
      z.object({
        userAddress: z.string(),
      }),
    )
    .output(
      z.object({
        id: z.string(),
        address: z.string(),
        userName: z.string(),
        description: z.string(),
        profileImage: z.string(),
        bannerImage: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await getUser({
        prisma: ctx.prisma,
        address: input.userAddress,
      });
      return user;
    }),
});

/**
 *  getUserListings: publicProcedure.query(async ({ ctx }) => {
    //TODO: pasar el user address en la session
    const userListings = await getUserListings({
      prisma: ctx.prisma,
      userAddress: "0x00000",
    });
    if (!userListings) {
      throw new Error("Problema obteniendo user listings");
    }
    return userListings;
  }),
 */
