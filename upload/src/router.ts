import express, { Request, Response } from "express";
import multer from "multer";
import PatientFile from "./controllers/PatientFile";

const upload = multer({ dest: "public/tmp/" });

const router = express.Router();

router.post("/upload/patient-file", upload.single("myfile"), PatientFile.upload);

export default router;