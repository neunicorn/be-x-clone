import Multer from "multer";

export const multer = Multer({
  storage: Multer.memoryStorage(),
});
