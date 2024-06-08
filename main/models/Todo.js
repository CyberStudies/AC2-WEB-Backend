const mongoose = require("mongoose");

const Todo = mongoose.model("Todo", {
  titulo: String,
  descricao: String,
  feito: Boolean,
  proprietario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
});

module.exports = Todo;
