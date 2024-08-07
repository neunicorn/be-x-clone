import express from "express";
import { jwtAuth } from "../middleware/jwtAuth.js";
import notificationController from "../controller/notification.controllers.js";

export const notificationRouter = express.Router();

notificationRouter.get("/", jwtAuth(), notificationController.getNotification);
notificationRouter.delete(
  "/",
  jwtAuth(),
  notificationController.deleteNotification
);
