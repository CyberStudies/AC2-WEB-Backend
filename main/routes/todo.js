// routes/todos.js
const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Função de autenticação
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, "ac2webTales212170", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Rota para listar as tarefas do usuário logado
router.get("/", authenticateToken, async (req, res) => {
  const todos = await Todo.find({ owner: req.user._id });
  res.json(todos);
});

// Rota para editar uma tarefa específica do usuário logado
router.put("/:id", authenticateToken, async (req, res) => {
  const updatedTodo = await Todo.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    req.body,
    { new: true }
  );
  res.json(updatedTodo);
});

// Rota para excluir uma tarefa específica do usuário logado
router.delete("/:id", authenticateToken, async (req, res) => {
  const deletedTodo = await Todo.findOneAndDelete({
    _id: req.params.id,
    owner: req.user._id,
  });
  res.json(deletedTodo);
});

// Rota para criar uma nova tarefa
router.post("/", authenticateToken, async (req, res) => {
  const newTodo = new Todo({
    ...req.body,
    owner: req.user._id,
  });
  const savedTodo = await newTodo.save();
  res.json(savedTodo);
});

// Rota para trazer as tarefas que não possuem um dono
router.get("/unowned", authenticateToken, async (req, res) => {
  const unownedTodos = await Todo.find({ owner: null });
  res.json(unownedTodos);
});

// Rota para adicionar um dono a uma tarefa específica
router.put("/:id/owner", authenticateToken, async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) return res.status(404).send("Todo not found");
  if (todo.owner) return res.status(400).send("Todo already has an owner");

  todo.owner = req.user._id;
  const updatedTodo = await todo.save();
  res.json(updatedTodo);
});

module.exports = router;
