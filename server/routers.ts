import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { authenticateUser, initializeAdminUser } from "./auth";
import { sdk } from "./_core/sdk";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    login: publicProcedure
      .input(
        z.object({
          username: z.string().min(1, 'Username is required'),
          password: z.string().min(1, 'Password is required'),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const user = await authenticateUser(input.username, input.password);
        if (!user) {
          throw new Error('Invalid username or password');
        }

        // Create session token using SDK
        const sessionToken = await sdk.createSessionToken(
          user.openId || `local-${user.id}`,
          { name: user.name || 'Admin' }
        );

        // Set session cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, cookieOptions);

        return {
          success: true,
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        };
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Initialize admin user on startup
  _init: publicProcedure.query(async () => {
    await initializeAdminUser();
    return { success: true };
  }),

  // Clientes
  clients: router({
    list: protectedProcedure.query(async () => {
      const { getClients } = await import('./db');
      return getClients();
    }),
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        status: z.enum(['active', 'inactive', 'pending']).default('active'),
      }))
      .mutation(async ({ input }) => {
        const { createClient } = await import('./db');
        return createClient(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        status: z.enum(['active', 'inactive', 'pending']).optional(),
      }))
      .mutation(async ({ input }) => {
        const { updateClient } = await import('./db');
        const { id, ...data } = input;
        return updateClient(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const { deleteClient } = await import('./db');
        return deleteClient(input.id);
      }),
  }),

  // Produtos
  products: router({
    list: protectedProcedure.query(async () => {
      const { getProducts } = await import('./db');
      return getProducts();
    }),
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        price: z.string().or(z.number()),
        category: z.enum(['paver', 'bloco', 'guia', 'outro']),
        unit: z.enum(['m2', 'un', 'm_linear']),
        description: z.string().optional(),
        stock: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        const { createProduct } = await import('./db');
        return createProduct(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        price: z.string().or(z.number()).optional(),
        category: z.enum(['paver', 'bloco', 'guia', 'outro']).optional(),
        unit: z.enum(['m2', 'un', 'm_linear']).optional(),
        description: z.string().optional(),
        stock: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { updateProduct } = await import('./db');
        const { id, ...data } = input;
        return updateProduct(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const { deleteProduct } = await import('./db');
        return deleteProduct(input.id);
      }),
  }),

  // Quotations (Pedidos)
  quotations: router({
    list: protectedProcedure.query(async () => {
      const { getQuotations } = await import('./db');
      return getQuotations();
    }),
    create: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        description: z.string().optional(),
        area: z.string().or(z.number()).optional(),
        totalValue: z.string().or(z.number()),
        deliveryValue: z.string().or(z.number()).default(0),
        status: z.enum(['approved', 'pending', 'rejected', 'completed']).default('pending'),
      }))
      .mutation(async ({ input }) => {
        const { createQuotation } = await import('./db');
        return createQuotation(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        clientId: z.number().optional(),
        description: z.string().optional(),
        area: z.string().or(z.number()).optional(),
        totalValue: z.string().or(z.number()).optional(),
        deliveryValue: z.string().or(z.number()).optional(),
        status: z.enum(['approved', 'pending', 'rejected', 'completed']).optional(),
      }))
      .mutation(async ({ input }) => {
        const { updateQuotation } = await import('./db');
        const { id, ...data } = input;
        return updateQuotation(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const { deleteQuotation } = await import('./db');
        return deleteQuotation(input.id);
      }),
  }),

  // Notes (Anotações)
  notes: router({
    list: protectedProcedure.query(async () => {
      const { getNotes } = await import('./db');
      return getNotes();
    }),
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        content: z.string().optional(),
        color: z.enum(['yellow', 'blue', 'green', 'pink', 'purple']).default('yellow'),
        isPinned: z.boolean().default(false),
      }))
      .mutation(async ({ input }) => {
        const { createNote } = await import('./db');
        return createNote(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        color: z.enum(['yellow', 'blue', 'green', 'pink', 'purple']).optional(),
        isPinned: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { updateNote } = await import('./db');
        const { id, ...data } = input;
        return updateNote(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const { deleteNote } = await import('./db');
        return deleteNote(input.id);
      }),
  }),

  settings: router({
    getRevenue: protectedProcedure.query(async () => {
      const { getSetting } = await import('./db');
      const setting = await getSetting('totalRevenue');
      return { totalRevenue: setting ? parseFloat(setting.value) : 0 };
    }),
    setRevenue: protectedProcedure
      .input(z.object({ totalRevenue: z.number() }))
      .mutation(async ({ input }) => {
        const { setSetting } = await import('./db');
        await setSetting('totalRevenue', input.totalRevenue.toString());
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
