import express from "express";
import { PORT } from "./config.js";

const app = express();

app.get("/", (req, res) => {
  response.send("Hello Angel Gala!");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
});
app.post("/register", (req, res) => {});
app.post("/logout", (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
