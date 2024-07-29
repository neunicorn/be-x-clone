import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "../routes/auth.routes.js";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors);
app.use(cookieParser);

app.use("/api/auth", authRouter);
