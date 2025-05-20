import express from "express";
import "dotenv/config";
import cors from "cors";
import { transporter } from "./utils/transporter";
import { sendSimpleTestEmail } from "./utils/mails/test.mail";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/mail", (req, res) => {
  res.send("Api mail: Hello World!");
});

const port = process.env.SERVER_PORT;

transporter.verify((error, success) => {
  if (error) {
    console.error(error);
  } else {
    console.info("Server is ready to take our messages: ", success);
  }
});

app.listen(port, () => {
  console.log(`Server to manage emails is running on http://localhost:${port}`);
});
