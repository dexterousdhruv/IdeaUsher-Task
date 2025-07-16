import z from "zod";

export const postSchema = z.object({
  title: z
    .string("Title is required")
    .min(3, "Title must be at least 3 characters long"),

  description: z
    .string("Description is required")
    .min(10, "Description must be at least 10 characters long"),

  tags: z.preprocess((val) => {
    if (typeof val === "string") return [val];
    return val;
  }, z.array(z.string().nonempty("Tag cannot be empty")).min(1, "At least one tag is required")),
});

export const urlSchema = z.url("URL is missing or Invalid URL format");