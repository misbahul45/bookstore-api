import { z } from "zod";

export class BookSchema {
  static create=z.object({
    title: z.string().min(1, { message: "Title is required" }),
    userId: z.string().min(1, { message: "User ID is required" }),
    author: z.string().min(1, { message: "Author is required" }),
    caption: z.string().min(1, { message: "Caption is required" }),
    image: z.string().min(1, { message: "Image is required" }).url({ message: "Image must be a valid URL" }),
    rating: z.number().min(1, { message: "Rating is required" }),
  });
}