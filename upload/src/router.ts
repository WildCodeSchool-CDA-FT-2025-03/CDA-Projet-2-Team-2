import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import PatientFile from "./controllers/PatientFile";
import { authMiddleware } from "./middlewares/auth.middleware";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/patient/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})
const upload = multer({ storage: storage });

const router = express.Router();

router.post("/upload/patient-file", authMiddleware(['secretary']), upload.single("myfile"), PatientFile.upload);

export default router;