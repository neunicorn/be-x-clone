import { app } from "./application/app.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import connectMongoDB from "./db/connect.js";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

app.listen(process.env.PORT, () => {
  console.log(`server is started on localhost:${process.env.PORT}`);
  connectMongoDB();
});
