import { db } from "../config/db.js";

export const User = {
  async findByEmail(email) {
    const [rows] = await db.execute("SELECT * FROM usuarios WHERE email = ?", [email]);
    return rows[0];
  },
};
