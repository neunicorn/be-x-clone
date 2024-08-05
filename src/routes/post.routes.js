import express from "express";
import { jwtAuth } from "../middleware/jwtAuth.js";

export const postRouter = express.Router();

// postRouter.get("/post", jwtAuth());
// postRouter.get("/post/:id", jwtAuth());
postRouter.post("/create", jwtAuth());
// postRouter.post("/like/:id", jwtAuth());
// postRouter.post("/comment/:id", jwtAuth());
// postRouter.delete("/", jwtAuth());
