import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const roomRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        votesVisible: z.boolean().optional(), // Added votesVisible field
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.room.create({
        data: {
          name: input.name,
          description: input.description,
          ownerId: ctx.session.user.id,
          votesVisible: input.votesVisible ?? false, // Set votesVisible
          participants: {
            connect: { id: ctx.session.user.id },
          },
        },
      });
    }),

  join: protectedProcedure
    .input(
      z.object({
        roomId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.room.update({
        where: { id: input.roomId },
        data: {
          participants: {
            connect: { id: ctx.session.user.id },
          },
        },
      });
    }),

  getRoom: protectedProcedure
    .input(
      z.object({
        roomId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.room.findUnique({
        where: { id: input.roomId },
        include: {
          participants: true,
          votes: {
            include: {
              user: true,
            },
          },
        },
      });
    }),

  listRooms: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.room.findMany({
      where: {
        participants: {
          some: {
            id: ctx.session.user.id,
          },
        },
      },
    });
  }),

  toggleVotesVisible: protectedProcedure
    .input(
      z.object({
        roomId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const room = await ctx.db.room.findUnique({
        where: { id: input.roomId },
      });

      if (!room) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Room not found",
        });
      }

      return ctx.db.room.update({
        where: { id: input.roomId },
        data: {
          votesVisible: !room.votesVisible,
        },
      });
    }),
});