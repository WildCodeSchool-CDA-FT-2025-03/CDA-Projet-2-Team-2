const express = require("express");
const multer = require("multer");
import PatientFile from "./controllers/PatientFile";

const upload = multer({ dest: "public/tmp/" });

const router = express.Router();

router.post("/patient-file", upload.single("myfile"), PatientFile.upload);

export default router;