import express from "express";
import { jwtAuth } from "../middleware/jwtAuth.js";
import postController from "../controller/post.controller.js";

export const postRouter = express.Router();

// postRouter.get("/post", jwtAuth());
// postRouter.get("/post/:id", jwtAuth());
postRouter.post("/create", jwtAuth(), postController.createPost);
postRouter.post("/like/:id", jwtAuth(), postController.likeUnlikePost);
postRouter.post("/comment/:id", jwtAuth(), postController.createCommentPost);
postRouter.delete("/:id", jwtAuth(), postController.deletePost);
