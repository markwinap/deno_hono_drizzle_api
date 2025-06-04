ALTER TABLE "Post" DROP CONSTRAINT "Post_userId_fkey";
--> statement-breakpoint
DROP INDEX "User_email_key";--> statement-breakpoint
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;