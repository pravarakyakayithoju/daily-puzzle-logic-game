import { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id, email, name } = req.body;

  try {
    await pool.query(
      `INSERT INTO users (id, email, name)
       VALUES ($1, $2, $3)
       ON CONFLICT (id) DO NOTHING`,
      [id, email, name]
    );

    return res.status(200).json({ message: "User created" });
  } catch (error) {
    return res.status(500).json({ error: "Database error" });
  }
}
