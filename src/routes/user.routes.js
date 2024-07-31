import express from "express";
import { jwtAuth } from "../middleware/jwtAuth.js";
import userController from "../controller/user.controller.js";

export const userRouter = express.Router();

userRouter.get("/profile/:username", jwtAuth(), userController.getUserProfile);
userRouter.get("/suggested", jwtAuth(), userController.getSuggestedProfile);
userRouter.post("/follow/:id", jwtAuth(), userController.followOrUnfollow);
userRouter.post("/update", jwtAuth(), userController.updateProfile);