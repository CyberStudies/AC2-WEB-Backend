const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

const TodoRoutes = require("./routes/todo");
app.use("/Todo", TodoRoutes);

mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(27017, () => {
      console.log("Conectado ao MongoDB");
      console.log("Servidor iniciado na porta 27017");
    });
  })
  .catch((err) => {
    console.log(err);
  });

const usuarioRoutes = require("./routes/usuario");
app.use("/usuario", usuarioRoutes);
