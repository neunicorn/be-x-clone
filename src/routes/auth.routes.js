import express from "express";
import authController from "../controller/auth.controller.js";

export const authRouter = new express.Router();

authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.signin);
