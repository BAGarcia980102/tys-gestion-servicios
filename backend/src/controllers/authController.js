import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/User.js";
dotenv.config();

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user.id, rol: user.rol, nombre: user.nombre },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // Redirección según rol
    let panel = "";
    if (user.rol === "operativo") panel = "/panel-operativo";
    if (user.rol === "coordinador") panel = "/panel-coordinador";
    if (user.rol === "gerente") panel = "/panel-gerente";
    if (user.rol === "asesor") panel = "/panel-asesor";

    res.status(200).json({ token, rol: user.rol, panel });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};
