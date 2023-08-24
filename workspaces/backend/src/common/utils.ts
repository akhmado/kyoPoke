import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = "secret-key";

export function generateRandomNumberInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function signJwtToken(email: string) {
  return jwt.sign(
    { email, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
    "secret-key"
  );
}

export function verifyJwtToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET_KEY) as { email: string };
  } catch (err) {
    return null;
  }
}
