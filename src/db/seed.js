import fs, { Utf8Stream } from "fs";
import path from "path";
import pool from "./indexdb.js";

const filesAlquran = [
  "quran-indonesia-db/surah-indonesia.sql",
  "quran-indonesia-db/quran-indonesia.sql",
];

const statements = sqlreadFile
  .split(";")
  .map((s) => s.trim)
  .filter((s) => s.length > 0);

try {
  for (const file of filesAlquran) {
    const sql = fs.readFileSync(path.resolve(file), "Utf-8");
    await pool.query(sql);
    console.log(`✓ ${file} done`);
  }
  console.log("Seeding done!");
} catch (err) {
  console.error("Error:", err.message); // ← tambahin ini
}
await pool.end();
