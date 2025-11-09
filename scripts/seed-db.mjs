import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { books, posts } from "../drizzle/schema.ts";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const sampleBooks = [
  {
    slug: "dom-casmurro",
    title: "Dom Casmurro",
    author: "Machado de Assis",
    description: "Um clássico da literatura brasileira",
    synopsis: "Dom Casmurro é um romance de Machado de Assis que explora temas de ciúme, traição e memória.",
    year: 1899,
    isbn: "978-8535914696",
    pages: 256,
    genre: "Romance",
    language: "pt-BR",
    formats: JSON.stringify(["PDF", "EPUB"]),
    languages: JSON.stringify(["pt-BR"]),
    isPublished: true,
  },
];

await db.insert(books).values(sampleBooks);
console.log("✓ Database seeded!");
process.exit(0);
