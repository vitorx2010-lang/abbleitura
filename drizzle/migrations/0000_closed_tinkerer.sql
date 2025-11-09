ALTER TABLE `books` MODIFY COLUMN `formats` json;--> statement-breakpoint
ALTER TABLE `books` MODIFY COLUMN `languages` json;--> statement-breakpoint
ALTER TABLE `comments` MODIFY COLUMN `translatedContent` json;--> statement-breakpoint
ALTER TABLE `posts` MODIFY COLUMN `tags` json;