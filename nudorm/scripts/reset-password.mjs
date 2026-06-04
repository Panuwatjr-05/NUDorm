import bcrypt from "bcryptjs";
import pg from "pg";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "../.env.local") });
config({ path: join(__dirname, "../.env") });

const EMAIL = "poom2@gmail.com";
const NEW_PASSWORD = "admin1234"; // เปลี่ยนตรงนี้ได้

async function resetPassword() {
  const hash = await bcrypt.hash(NEW_PASSWORD, 12);

  const client = new pg.Client({
    connectionString: process.env.DIRECT_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  const res = await client.query(
    'UPDATE "User" SET password = $1 WHERE email = $2 RETURNING email, name, role',
    [hash, EMAIL]
  );

  if (res.rowCount === 0) {
    console.log("ไม่พบ user:", EMAIL);
  } else {
    console.log("Reset password สำเร็จ!", res.rows[0]);
    console.log(`\nใช้ login ด้วย:\nEmail: ${EMAIL}\nPassword: ${NEW_PASSWORD}`);
  }

  await client.end();
}

resetPassword().catch(console.error);
