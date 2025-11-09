import bcrypt from "bcryptjs";

const password = "123456";
const saltRounds = 10;

const hash = await bcrypt.hash(password, saltRounds);
console.log("Hash generado:", hash);
