import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js"; // ✅ importa las rutas
import "./src/config/db.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ registra las rutas con el prefijo /api/auth
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${process.env.PORT}`);
});
