import { app } from "./application/app.js";
import dotenv from "dotenv";
import connectMongoDB from "./db/connect.js";

dotenv.config();

app.listen(process.env.PORT, () => {
  console.log(`server is started on localhost:${process.env.PORT}`);
  connectMongoDB();
});
