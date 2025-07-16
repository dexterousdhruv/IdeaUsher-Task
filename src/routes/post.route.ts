import { Router } from "express";
import { createPost, getAllPosts, getPostsByKeyword, getPostsByTags } from "../controllers/post.controller";
import { upload } from "../utils/multerConfig";


const router = Router()

router.post("/", upload.single("coverImage"), createPost) 
router.get("/", getAllPosts)
router.get("/search", getPostsByKeyword) 
router.get("/by-tags", getPostsByTags) 

export default router