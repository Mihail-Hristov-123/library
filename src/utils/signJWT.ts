import jwt from "jsonwebtoken";
const jwtKey = process.env.JWT_KEY;

export const signJWT = (name: string, email: string) => {
  try {
    if (!jwtKey) throw new Error("Invalid server setup");
    const token = jwt.sign({ name, email }, jwtKey, { expiresIn: "1d" });
    return token;
  } catch (error) {
    console.error(`Error occurred during JWT signing ${error}`);
    throw new Error(`Server error occurred during authentication`);
  }
};
