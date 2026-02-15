import { neon } from "@neondatabase/serverless";

const sql = neon(import.meta.env.VITE_DATABASE_URL);

export async function createUser(id: string, email: string, name: string) {
  await sql`
    INSERT INTO users (id, email, name)
    VALUES (${id}, ${email}, ${name})
    ON CONFLICT (id) DO NOTHING
  `;
}
