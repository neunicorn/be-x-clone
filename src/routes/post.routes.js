import express from "express";
import { jwtAuth } from "../middleware/jwtAuth.js";
import postController from "../controller/post.controller.js";

export const postRouter = express.Router();

postRouter.get("/", jwtAuth(), postController.getAllPost);
postRouter.get("/following", jwtAuth(), postController.getFollowingPost);
postRouter.get("/:postId", jwtAuth(), postController.getOnePost);
postRouter.get("/user/:username", jwtAuth(), postController.getUserPosts);
postRouter.get("/:userId/liked", jwtAuth(), postController.getLikedPost);
postRouter.post("/", jwtAuth(), postController.createPost);
postRouter.post("/comment/:id", jwtAuth(), postController.createCommentPost);
postRouter.post("/like/:id", jwtAuth(), postController.likeUnlikePost);
postRouter.delete("/:id", jwtAuth(), postController.deletePost);
