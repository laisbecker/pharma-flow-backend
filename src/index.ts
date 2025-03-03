require('dotenv').config()

import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./database/data-source";
import cors from "cors";
import userRouter from "./routes/user.routes";
import { handleError } from "./middlewares/handleError";
import authRouter from "./routes/auth.routes";
import logger from "./config/winston";
import productRouter from "./routes/product.routes";

const app = express();

app.use(cors()); // Permite que o express entenda requisições de outros domínios
app.use(express.json()); // Permite que o express entenda JSON

app.use("/users", userRouter);
app.use("/login", authRouter);
app.use("/products", productRouter);

app.get("/env", (req, res) => {
  res.json({
    port: process.env.PORT,
    node_env: process.env.NODE_ENV,
  });
});

app.use(handleError);

AppDataSource.initialize()
  .then(() => {
    console.log("[DB] Banco de dados conectado com sucesso!");
    app.listen(process.env.PORT, () => {
      logger.info(`Servidor rodando na porta ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("[DB ERRO] Falha na conexão com o banco:", error);
    process.exit(1);
  })
