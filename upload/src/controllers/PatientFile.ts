import { Request, Response } from "express";
import fs from "fs";
import "dotenv/config";

interface MulterRequest extends Request {
  file: Express.Multer.File;
}

class PatientFile {
  static upload = (req: MulterRequest, res: Response) => {
    fs.rename(
      req.file.path,
      `public/patient/${req.file.originalname}`,
      (err) => {
        if (err) {
          res.status(400).send("Error while uploading");
        } else {
          res.status(203).json({
            msg: "Upload success",
            url: `http://${process.env.SERVER_URL}:${process.env.SERVER_PORT}/public/patient/${req.file.originalname}`,
          });
        }
      }
    );
  };
}

export default PatientFile;