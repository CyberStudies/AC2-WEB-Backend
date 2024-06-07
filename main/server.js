const express = require("express");
const mongoose = require("mongoose");
const itemRoutes = require("./routes/items");
const userRoutes = require("./routes/users");
const app = express();
app.use(express.json()); // Para poder acessar req.body
const port = 3000;

// Conexão com o MongoDB
mongoose
  .connect(
    "mongodb+srv://talesasfurlan:AaRUQmnEsCmTKFIe@cluster0.vhh3c0v.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// Usar as rotas
app.use("/items", itemRoutes);
app.use("/users", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
