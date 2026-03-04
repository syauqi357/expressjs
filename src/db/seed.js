import fs from "fs";
import path from "path";
import pool from "./indexdb.js";

const sqlreadFile = fs.readFileSync(
  path.resolve("quran-indonesia-db/quran-indonesia.sql"),
  "utf-8",
);

const statements = sqlreadFile
  .split(";")
  .map((s) => s.trim)
  .filter((s) => s.length > 0);

for (const statement of statements) {
  console.log("Executing:", statement.substring(0, 50));
  await pool.query(statement);
}

try {
  await pool.query(sqlreadFile);
  console.log("Seeding done!");
} catch (err) {
  console.error("Error:", err.message); // ← tambahin ini
}
await pool.end();
