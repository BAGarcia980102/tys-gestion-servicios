import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";
import solicitudRoutes from "./src/routes/solicitudRoutes.js"; // ✅ agrega esta línea
import "./src/config/db.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/solicitudes", solicitudRoutes); // ✅ registra el módulo de solicitudes

app.listen(process.env.PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${process.env.PORT}`);
});
