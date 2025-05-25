import { Request, Response, RequestHandler } from "express";
import fs from "fs";
import "dotenv/config";

class PatientFile {
  static upload: RequestHandler = (req: Request, res: Response) => {
    const file = req.file as Express.Multer.File;

    if (!file) {
      res.status(400).send("No file uploaded");
      return;
    }

    fs.rename(
      file.path,
      `public/patient/${file.filename}`,
      async (err) => {
        if (err) {
          res.status(400).send("Error while uploading");
        } else {
          const query = `
            mutation addDocumentMutation($docInput: PatientDocInput!) {
              addDocument(docInput: $docInput) {
                id
              }
            }
          `;

          const variables = {
            "docInput": {
              "name": req.body.name,
              "url": file.filename,
              "patientId": +req.body.patientId,
              "docTypeId": +req.body.type,
            },
          };
          try {
            const response = await fetch('http://server:4000/api', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Cookie': req.headers.cookie || '',
              },
              body: JSON.stringify({
                query,
                variables,
              }),
            });

            const result = await response.json();
            if (result.errors) {
              console.error('Erreur GraphQL:', result.errors);
              return res.status(500).json({ error: result.errors });
            }
          } catch (error) {
            console.error('Erreur réseau/fetch:', error);
            return res.status(500).send('Erreur serveur');
          }

          return res.status(203).json({
            msg: "Upload success",
            url: `${file.originalname}`,
          });
        }
      }
    );
  };
}

export default PatientFile;