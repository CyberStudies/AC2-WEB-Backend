// routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Função de autenticação
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, "ac2web", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Rota de Cadastro
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  // Verificar se o usuário já existe
  const user = await User.findOne({ username });
  if (user) return res.status(400).send("User already exists");

  // Criptografar a senha
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Criar novo usuário
  const newUser = new User({
    username,
    password: hashedPassword,
    role,
  });

  // Salvar o usuário e retornar
  const savedUser = await newUser.save();
  res.json(savedUser);
});

// Rota de Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Verificar se o usuário existe
  const user = await User.findOne({ username });
  if (!user) return res.status(400).send("User does not exist");

  // Verificar a senha
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send("Invalid password");

  // Criar e retornar um token
  const token = jwt.sign({ _id: user._id }, "ac2web");
  res.header("auth-token", token).send(token);
});

// Rota para listar todos os usuários
router.get("/", authenticateToken, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Rota para editar um usuário específico
router.put("/:id", authenticateToken, async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedUser);
});

// Rota para criar um novo usuário
router.post("/", authenticateToken, async (req, res) => {
  const newUser = new User(req.body);
  const savedUser = await newUser.save();
  res.json(savedUser);
});

// Rota para excluir um usuário específico
router.delete("/:id", authenticateToken, async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  res.json(deletedUser);
});

// Rota para obter a quantidade de usuários por função
router.get("/count", authenticateToken, async (req, res) => {
  const feEngineers = await User.countDocuments({ role: "Engenheiro de FE" });
  const beEngineers = await User.countDocuments({ role: "Engenheiro de BE" });
  const dataAnalysts = await User.countDocuments({ role: "Analista de dados" });
  const techLeads = await User.countDocuments({ role: "Líder Técnico" });

  res.json({
    "Engenheiro de FE": feEngineers,
    "Engenheiro de BE": beEngineers,
    "Analista de dados": dataAnalysts,
    "Líder Técnico": techLeads,
  });
});

module.exports = router;
