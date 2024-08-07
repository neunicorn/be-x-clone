import express from "express";
import { multer } from "../middleware/multer.js";
import { jwtAuth } from "../middleware/jwtAuth.js";
import userController from "../controller/user.controllers.js";

export const userRouter = express.Router();

userRouter.get("/suggested", jwtAuth(), userController.getSuggestedProfile);
userRouter.get("/profile/:username", jwtAuth(), userController.getUserProfile);
userRouter.post("/follow/:id", jwtAuth(), userController.followOrUnfollow);
userRouter.patch("/update", jwtAuth(), userController.updateProfile);
