import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET || "A7f$kP2x!dQ9mL0vR4s#tW8y";
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "1d";

export function generateToken(payload: object) {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as any, // workaround for type mismatch
  };

  return jwt.sign(payload, JWT_SECRET, options);
}
