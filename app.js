import express from "express";
import dotenv from "dotenv";

// learn today : to add env should already have dotenv.config(), if not there is undefined when it run
dotenv.config();

const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("hello, express");
});

app.listen(port, () => {
  console.log(`open in localhost ${port}`);
});
