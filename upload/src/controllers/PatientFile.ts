import { Request, Response, RequestHandler } from "express";
import fs from "fs";
import "dotenv/config";

class PatientFile {
  static upload: RequestHandler = (req: Request, res: Response) => {
    // ✅ Cast ici, pas dans la signature
    const file = req.file as Express.Multer.File;

    if (!file) {
      res.status(400).send("No file uploaded");
      return;
    }

    fs.rename(
      file.path,
      `public/patient/${file.originalname}`,
      (err) => {
        if (err) {
          res.status(400).send("Error while uploading");
        } else {
          res.status(203).json({
            msg: "Upload success",
            url: `${file.originalname}`,
          });
        }
      }
    );
  };
}

export default PatientFile;