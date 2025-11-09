import { eq, desc, and, like, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  books,
  posts,
  comments,
  downloads,
  favorites,
  translations,
  newsletterSubscriptions,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USERS ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ BOOKS ============

export async function getBooks(limit = 12, offset = 0, genre?: string, search?: string) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(books.isPublished, true)];

  if (genre) {
    conditions.push(eq(books.genre, genre));
  }

  if (search) {
    conditions.push(
      sql`${books.title} LIKE ${`%${search}%`} OR ${books.author} LIKE ${`%${search}%`}`
    );
  }

  return await db
    .select()
    .from(books)
    .where(and(...conditions))
    .orderBy(desc(books.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getBookBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(books).where(eq(books.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createBook(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(books).values(data);
  return result;
}

export async function updateBook(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(books).set(data).where(eq(books.id, id));
}

export async function deleteBook(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.delete(books).where(eq(books.id, id));
}

export async function likeBook(bookId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .update(books)
    .set({ likes: sql`${books.likes} + 1` })
    .where(eq(books.id, bookId));
}

// ============ POSTS ============

export async function getPosts(limit = 10, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(posts)
    .where(eq(posts.isPublished, true))
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
    .offset(offset);
}

export async function getPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createPost(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(posts).values(data);
}

export async function updatePost(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(posts).set(data).where(eq(posts.id, id));
}

export async function deletePost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.delete(posts).where(eq(posts.id, id));
}

// ============ COMMENTS ============

export async function getCommentsByBookId(bookId: number, approved = true) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(comments.bookId, bookId)];

  if (approved) {
    conditions.push(eq(comments.status, "approved"));
  }

  return await db
    .select()
    .from(comments)
    .where(and(...conditions))
    .orderBy(desc(comments.createdAt));
}

export async function createComment(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(comments).values(data);
}

export async function approveComment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(comments).set({ status: "approved" }).where(eq(comments.id, id));
}

export async function rejectComment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(comments).set({ status: "rejected" }).where(eq(comments.id, id));
}

export async function getPendingComments() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(comments)
    .where(eq(comments.status, "pending"))
    .orderBy(desc(comments.createdAt));
}

// ============ DOWNLOADS ============

export async function createDownload(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(downloads).values(data);
}

export async function getDownloadCount(userId: number, bookId: number) {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(downloads)
    .where(and(eq(downloads.userId, userId), eq(downloads.bookId, bookId)));

  return result[0]?.count || 0;
}

// ============ FAVORITES ============

export async function addFavorite(userId: number, bookId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(favorites).values({ userId, bookId });
}

export async function removeFavorite(userId: number, bookId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .delete(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.bookId, bookId)));
}

export async function getFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(favorites).where(eq(favorites.userId, userId));
}

// ============ TRANSLATIONS ============

export async function getTranslation(
  sourceLanguage: string,
  targetLanguage: string,
  sourceText: string
) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(translations)
    .where(
      and(
        eq(translations.sourceLanguage, sourceLanguage),
        eq(translations.targetLanguage, targetLanguage),
        eq(translations.sourceText, sourceText)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function cacheTranslation(
  sourceLanguage: string,
  targetLanguage: string,
  sourceText: string,
  translatedText: string,
  provider = "deepl"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(translations).values({
    sourceLanguage,
    targetLanguage,
    sourceText,
    translatedText,
    provider,
  });
}

// ============ NEWSLETTER ============

export async function subscribeNewsletter(email: string, language = "pt-BR") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .insert(newsletterSubscriptions)
    .values({ email, language })
    .onDuplicateKeyUpdate({
      set: { isActive: true, unsubscribedAt: null },
    });
}

export async function getNewsletterSubscribers(language?: string) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(newsletterSubscriptions.isActive, true)];

  if (language) {
    conditions.push(eq(newsletterSubscriptions.language, language));
  }

  return await db
    .select()
    .from(newsletterSubscriptions)
    .where(and(...conditions));
}
