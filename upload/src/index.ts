import express from "express";
import "dotenv/config";
import router from "./router";

const app = express();

app.use(express.json());

app.use(router);
app.use('/upload/public', express.static('public'));

const port = process.env.SERVER_PORT || 5050;

app.listen(port, () => {
  console.log(`Server to manage upload is running on http://localhost:${port}`);
});

