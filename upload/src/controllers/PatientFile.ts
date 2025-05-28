import { Request, Response, RequestHandler } from "express";
import fs from "fs";
import "dotenv/config";

class PatientFile {
  static deletefile = (filename: Express.Multer.File) => {
    const pathfile = filename.path;
    fs.unlink(pathfile, (err: NodeJS.ErrnoException | null) => {
      if (err) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  static upload: RequestHandler = (async (req: Request, res: Response) => {
    const file = req.file as Express.Multer.File;

    if (!file) {
      this.deletefile(file);
      res.sendStatus(422);
      return;
    }

    /**
     * Mutation + Variables GraphQL pour ajouter un document patient
     * Pour envoyer dans le body ensuite dans la requête fetch
     */
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

    /**
     * Dans l'idéal on devrait regénérer le token JWT pour le service l'upload
     * mais pour l'instant on utilise le token de l'utilisateur connecté
     */
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
        this.deletefile(file);
        return res.sendStatus(500);
      }
    } catch (error) {
      this.deletefile(file);
      return res.sendStatus(500);
    }

    return res.sendStatus(203);
  }) as RequestHandler;
}

export default PatientFile;