import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  json,
  datetime,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Books table
 */
export const books = mysqlTable("books", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  description: text("description"),
  synopsis: text("synopsis"),
  coverUrl: varchar("coverUrl", { length: 1024 }),
  year: int("year"),
  isbn: varchar("isbn", { length: 20 }),
  pages: int("pages"),
  genre: varchar("genre", { length: 100 }),
  language: varchar("language", { length: 50 }).default("pt-BR"),
  formats: json("formats").$type<string[]>(),
  languages: json("languages").$type<string[]>(),
  likes: int("likes").default(0),
  downloads: int("downloads").default(0),
  rating: decimal("rating", { precision: 3, scale: 1 }).default("0"),
  reviews: int("reviews").default(0),
  isPublished: boolean("isPublished").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Book = typeof books.$inferSelect;
export type InsertBook = typeof books.$inferInsert;

/**
 * Blog posts table
 */
export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  excerpt: varchar("excerpt", { length: 500 }),
  authorId: int("authorId").notNull(),
  tags: json("tags").$type<string[]>(),
  views: int("views").default(0),
  isPublished: boolean("isPublished").default(false),
  publishedAt: datetime("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

/**
 * Comments table
 */
export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  bookId: int("bookId"),
  postId: int("postId"),
  userId: int("userId").notNull(),
  content: text("content").notNull(),
  translatedContent: json("translatedContent").$type<Record<string, string>>(),
  detectedLanguage: varchar("detectedLanguage", { length: 10 }),
  likes: int("likes").default(0),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending"),
  parentCommentId: int("parentCommentId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;

/**
 * Downloads table (for tracking and rate limiting)
 */
export const downloads = mysqlTable("downloads", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  bookId: int("bookId").notNull(),
  format: varchar("format", { length: 20 }).notNull(),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  presignedUrl: varchar("presignedUrl", { length: 2048 }),
  expiresAt: datetime("expiresAt"),
  downloadedAt: datetime("downloadedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Download = typeof downloads.$inferSelect;
export type InsertDownload = typeof downloads.$inferInsert;

/**
 * User favorites table
 */
export const favorites = mysqlTable("favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  bookId: int("bookId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

/**
 * Translations cache table
 */
export const translations = mysqlTable("translations", {
  id: int("id").autoincrement().primaryKey(),
  sourceLanguage: varchar("sourceLanguage", { length: 10 }).notNull(),
  targetLanguage: varchar("targetLanguage", { length: 10 }).notNull(),
  sourceText: text("sourceText").notNull(),
  translatedText: text("translatedText").notNull(),
  provider: varchar("provider", { length: 50 }).default("deepl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Translation = typeof translations.$inferSelect;
export type InsertTranslation = typeof translations.$inferInsert;

/**
 * Newsletter subscriptions
 */
export const newsletterSubscriptions = mysqlTable("newsletterSubscriptions", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  language: varchar("language", { length: 10 }).default("pt-BR"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  unsubscribedAt: datetime("unsubscribedAt"),
});

export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletterSubscription = typeof newsletterSubscriptions.$inferInsert;
