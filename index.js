import express from "express";
import { PORT } from "./config.js";
import { UserRepository } from "./user-repository.js";

const app = express();

app.set("view engine", "ejs");
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserRepository.login({ username, password });
    res.send({ user });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  console.log({ username, password });

  try {
    const id = UserRepository.create({ username, password });
    res.status(200).send({ id });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.post("/logout", (req, res) => {});

app.post("/protected", (req, res) => {
  // TODO: if sesión del usuario
  res.render("protected");
  //   TODO: else 401
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
