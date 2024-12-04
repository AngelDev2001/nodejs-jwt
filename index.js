import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

import { PORT, SECRET_JWT_KEY } from "./config.js";
import { UserRepository } from "./user-repository.js";

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.render("index");

  try {
    const data = jwt.verify(token, SECRET_JWT_KEY);
    res.render("index", data); // {_id, username}
  } catch (e) {
    res.render("index");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserRepository.login({ username, password });
    const token = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_JWT_KEY,
      {
        expiresIn: "1h",
      }
    );
    res
      .cookie("access_token", token, {
        httpOnly: true, // la cookie solo se puede acceder en el servidor
        secure: process.env.NODE_ENV === "production", // la cookie solo puede acceder en https
        sameSite: "strict", // la cookie solo se puede acceder en el mismo dominio
        maxAge: 1000 * 60 * 60, // la cookie tiene un tiempo de validez de 1 hora
      })
      .send({ user, token });
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
  const token = req.cookies.access_token;

  if (!token) return res.status(403).send("Access note authorized");

  try {
    const data = jwt.verify(token, SECRET_JWT_KEY);
    res.render("index", data); // {_id, username}
  } catch (e) {
    res.status(401).send("Access not authorized");
  }

  // TODO: if sesión del usuario
  res.render("protected");
  //   TODO: else 401
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
