import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getBooks,
  getBookBySlug,
  createBook,
  updateBook,
  deleteBook,
  likeBook,
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  getCommentsByBookId,
  createComment,
  approveComment,
  rejectComment,
  getPendingComments,
  addFavorite,
  removeFavorite,
  getFavorites,
  createDownload,
  getDownloadCount,
  subscribeNewsletter,
  getNewsletterSubscribers,
} from "./db";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ BOOKS ============
  books: router({
    list: publicProcedure
      .input(
        z.object({
          limit: z.number().default(12),
          offset: z.number().default(0),
          genre: z.string().optional(),
          search: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const books = await getBooks(input.limit, input.offset, input.genre, input.search);
        return books;
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const book = await getBookBySlug(input.slug);
        return book;
      }),

    create: protectedProcedure
      .input(
        z.object({
          slug: z.string(),
          title: z.string(),
          author: z.string(),
          description: z.string().optional(),
          synopsis: z.string().optional(),
          coverUrl: z.string().optional(),
          year: z.number().optional(),
          isbn: z.string().optional(),
          pages: z.number().optional(),
          genre: z.string().optional(),
          formats: z.array(z.string()).optional(),
          languages: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Only admins can create books");
        }
        return await createBook(input);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          author: z.string().optional(),
          description: z.string().optional(),
          synopsis: z.string().optional(),
          coverUrl: z.string().optional(),
          year: z.number().optional(),
          isbn: z.string().optional(),
          pages: z.number().optional(),
          genre: z.string().optional(),
          formats: z.array(z.string()).optional(),
          languages: z.array(z.string()).optional(),
          isPublished: z.boolean().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Only admins can update books");
        }
        const { id, ...data } = input;
        return await updateBook(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Only admins can delete books");
        }
        return await deleteBook(input.id);
      }),

    like: publicProcedure
      .input(z.object({ bookId: z.number() }))
      .mutation(async ({ input }) => {
        return await likeBook(input.bookId);
      }),
  }),

  // ============ POSTS ============
  posts: router({
    list: publicProcedure
      .input(
        z.object({
          limit: z.number().default(10),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return await getPosts(input.limit, input.offset);
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await getPostBySlug(input.slug);
      }),

    create: protectedProcedure
      .input(
        z.object({
          slug: z.string(),
          title: z.string(),
          content: z.string(),
          excerpt: z.string().optional(),
          tags: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Only admins can create posts");
        }
        return await createPost({
          ...input,
          authorId: ctx.user.id,
          isPublished: false,
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          content: z.string().optional(),
          excerpt: z.string().optional(),
          tags: z.array(z.string()).optional(),
          isPublished: z.boolean().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Only admins can update posts");
        }
        const { id, ...data } = input;
        const updateData: any = data;
        if (data.isPublished) {
          updateData.publishedAt = new Date();
        }
        return await updatePost(id, updateData);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Only admins can delete posts");
        }
        return await deletePost(input.id);
      }),
  }),

  // ============ COMMENTS ============
  comments: router({
    getByBookId: publicProcedure
      .input(z.object({ bookId: z.number() }))
      .query(async ({ input }) => {
        return await getCommentsByBookId(input.bookId, true);
      }),

    create: protectedProcedure
      .input(
        z.object({
          bookId: z.number().optional(),
          postId: z.number().optional(),
          content: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return await createComment({
          ...input,
          userId: ctx.user.id,
          status: "pending",
        });
      }),

    approve: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Only admins can approve comments");
        }
        return await approveComment(input.id);
      }),

    reject: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Only admins can reject comments");
        }
        return await rejectComment(input.id);
      }),

    getPending: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Only admins can view pending comments");
      }
      return await getPendingComments();
    }),
  }),

  // ============ FAVORITES ============
  favorites: router({
    add: protectedProcedure
      .input(z.object({ bookId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        return await addFavorite(ctx.user.id, input.bookId);
      }),

    remove: protectedProcedure
      .input(z.object({ bookId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        return await removeFavorite(ctx.user.id, input.bookId);
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await getFavorites(ctx.user.id);
    }),
  }),

  // ============ DOWNLOADS ============
  downloads: router({
    create: protectedProcedure
      .input(
        z.object({
          bookId: z.number(),
          format: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Check download limit (10 per day)
        const count = await getDownloadCount(ctx.user.id, input.bookId);
        if (count >= 10) {
          throw new Error("Download limit exceeded (10 per day)");
        }

        // Create presigned URL (mock - in production use S3)
        const presignedUrl = `https://s3.example.com/books/${input.bookId}/${input.format}`;
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        return await createDownload({
          userId: ctx.user.id,
          bookId: input.bookId,
          format: input.format,
          ipAddress: ctx.req.ip,
          userAgent: ctx.req.headers["user-agent"],
          presignedUrl,
          expiresAt,
        });
      }),
  }),

  // ============ NEWSLETTER ============
  newsletter: router({
    subscribe: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          language: z.string().default("pt-BR"),
        })
      )
      .mutation(async ({ input }) => {
        return await subscribeNewsletter(input.email, input.language);
      }),

    getSubscribers: protectedProcedure
      .input(z.object({ language: z.string().optional() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Only admins can view subscribers");
        }
        return await getNewsletterSubscribers(input.language);
      }),
  }),
});

export type AppRouter = typeof appRouter;
