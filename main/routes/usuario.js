const express = require("express");
const router = express.Router();
const Usuario = require(".models/Usuario");
const verifyToken = require("../middleware/auth");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Rota de login
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  // Buscar usuário no banco de dados
  const usuario = await Usuario.findOne({ email });

  // Verificar se o usuário existe e a senha está correta
  if (!usuario || senha !== usuario.senha) {
    return res.status(401).send("Email ou senha inválidos");
  }

  // Gerar um token JWT
  const token = jwt.sign({ _id: usuario._id }, process.env.TOKEN_KEY);

  // Enviar o token na resposta
  res.status(200).json({ token });
});

// Rota de cadastro
router.post("/register", async (req, res) => {
  const { nome, email, senha, funcao } = req.body;

  // Criar um novo usuário
  const usuario = new Usuario({ nome, email, senha, funcao });

  // Salvar o usuário no banco de dados
  await usuario.save();

  // Enviar uma resposta de sucesso
  res.status(201).send("Usuário criado com sucesso");
});

// Rota autenticada para retornar o perfil do usuário
router.get("/profile", verifyToken, async (req, res) => {
  // Buscar o usuário no banco de dados usando o ID armazenado no token
  const usuario = await Usuario.findById(req.user._id);

  // Enviar uma resposta com o perfil do usuário
  res.status(200).json(usuario);
});

// Rota para editar um usuário específico
router.put("/:id", verifyToken, async (req, res) => {
  const { nome, email, senha, funcao } = req.body;

  // Atualizar o usuário no banco de dados
  const usuario = await Usuario.findByIdAndUpdate(
    req.params.id,
    { nome, email, senha, funcao },
    { new: true }
  );

  // Enviar uma resposta com o usuário atualizado
  res.status(200).json(usuario);
});

// Rota para excluir um usuário específico
router.delete("/:id", verifyToken, async (req, res) => {
  // Excluir o usuário do banco de dados
  await Usuario.findByIdAndDelete(req.params.id);

  // Enviar uma resposta de sucesso
  res.status(200).send("Usuário excluído com sucesso");
});

// Rota para trazer a quantidade de usuários separados por função
router.get("/count", verifyToken, async (req, res) => {
  // Contar o número de usuários para cada função
  const count = await Usuario.aggregate([
    { $group: { _id: "$funcao", count: { $sum: 1 } } },
  ]);

  // Enviar uma resposta com a contagem
  res.status(200).json(count);
});

module.exports = router;
