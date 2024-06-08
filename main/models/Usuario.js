// models/User.js
// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//   username: String,
//   password: String,
//   role: String,
// });

// module.exports = mongoose.model("User", UserSchema);
const mongoose = require("mongoose");

const Usuario = mongoose.model("Usuario", {
  nome: String,
  email: String,
  senha: String,
  funcao: {
    type: String,
    enum: [
      "Engenheiro de FE",
      "Engenheiro de BE",
      "Analista de dados",
      "Líder Técnico",
    ],
  },
});

module.exports = Usuario;
