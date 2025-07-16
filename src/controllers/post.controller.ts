import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import Tag from "../models/tag.model";
import Post from "../models/post.model";
import { postSchema, urlSchema } from "../utils/validations";
import { uploadToCloudinaryFromBuffer } from "../utils/cloudinary";

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = postSchema.safeParse(req.body);

    if (!parsed.success) {
      return next(createError(400, parsed.error!.issues[0].message));
    }

    const { title, description, tags } = parsed.data;

    if (!req.file) {
      return next(createError(404, "Cover image is required!"));
    }

    const imageUrl = await uploadToCloudinaryFromBuffer(req.file?.buffer, req.file?.originalname);
    let parsedUrl = urlSchema.safeParse(imageUrl);

    if (!parsedUrl.success) {
      return next(createError(400, parsedUrl.error!.issues[0].message));
    }

    const tagIds = await Promise.all(
      tags.map(async (name: string) => {
        name = name.toLowerCase().trim()
        const existing = await Tag.findOne({ name });
        return existing ? existing._id : (await Tag.create({ name }))._id;
      })
    );

    console.log({
      title,
      description,
      imageUrl,
      tags: tagIds,
    });

    const post = await Post.create({
      title,
      description,
      coverImage: imageUrl,
      tags: tagIds,
    });

    const populated = await post.populate("tags");

    return res.status(201).json(populated);
  } catch (e) {
    console.error("Error in createPost controller: ", e);
    return next(
      createError(500, "Error creating post, Please try again later!")
    );
  }
};

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sort = "desc", keyword } = req.query;
    const limit = parseInt(req.query?.limit as string) || 10;
    const page = parseInt(req.query?.page as string) || 1;

    const [posts, totalPosts] = await Promise.all([
      Post.find({
        ...(keyword && {
          $or: [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ],
        }),
      })
        .populate("tags")
        .sort({ createdAt: sort === "asc" ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit),

      Post.countDocuments(),
    ]);

    return res.status(200).json({
      page,
      totalPages: Math.round(totalPosts / limit),
      limit,
      totalPosts,
      posts,
    });
  } catch (e) {
    console.error("Error in getAllPosts controller:", e);
    return next(
      createError(500, "Error fetching posts. Please try again later.")
    );
  }
};

export const getPostsByTags = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tagQuery = (req.query?.tags as string) || "";

    const tagNames = tagQuery
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (tagNames.length === 0) {
      return next(
        createError(400, "Please provide at least one tag to filter by.")
      );
    }

    const tagIds = (await Tag.find({ name: { $in: tagNames } }).select("_id")).map(tag => tag._id);

    const posts = await Post.find({ tags: { $in: tagIds } }).populate("tags");

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getPostsByTags controller:", error);
    return next(
      createError(500, "Error fetching posts by tags. Please try again later.")
    );
  }
};

export const getPostsByKeyword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const q = req.query.q;

    if (!q || typeof q !== "string") {
      return next(
        createError(400, "Query parameter `q` is required for search.")
      );
    }

    const posts = await Post.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    }).populate("tags");

    return res.status(200).json(posts);
  } catch (err) {
    console.error("Error in searchPostsByKeyword:", err);
    return next(createError(500, "Failed to search posts. Please try again."));
  }
};
