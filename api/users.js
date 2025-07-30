import express from "express";
import bcrypt from "bcrypt";
const router = express.Router();
export default router;

import bcrypt from "bcrypt";
import { createUser, getUserByUsername } from "#db/queries/users";
import { createToken } from "#utils/jwt";
import requireBody from "#middleware/requireBody";

router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    console.log("req", req);

    const existing = await getUserByUsername(username);
    console.log("existing", existing);
    if (existing) return res.status(400).send("Username already taken");

    const user = await createUser(username, password);
    const token = createToken({ id: user.id });
    res.status(201).send(token);
  }
);

router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    if (!user) return res.status(401).send("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    console.log("password", password);
    console.log("user", user);
    console.log("match", match);

    if (!match) return res.status(401).send("Invalid credentials");

    const token = createToken({ id: user.id });
    res.send(token);
  }
);
