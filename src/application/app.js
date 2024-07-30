import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "../routes/auth.routes.js";
import { errorMiddleware } from "../middleware/error-middleware.js";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

console.log("TEST");
app.use("/api/auth", authRouter);

app.use(errorMiddleware);
