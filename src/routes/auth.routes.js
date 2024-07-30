import express from "express";
import authController from "../controller/auth.controller.js";
import { jwtAuth } from "../middleware/jwtAuth.js";

export const authRouter = express.Router();

console.log("ReQUEST IN");

authRouter.post("/signup", authController.signup);
authRouter.post("/signin", authController.signin);
authRouter.delete("/logout", jwtAuth(), authController.logout);
