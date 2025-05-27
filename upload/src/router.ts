import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import PatientFile from "./controllers/PatientFile";
import { authMiddleware } from "./middlewares/auth.middleware";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/tmp/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})
const upload = multer({ storage: storage });

const router = express.Router();

router.use('/upload/patient-file', authMiddleware(['secretary']));

router.post("/upload/patient-file", upload.single("myfile"), PatientFile.upload);

export default router;