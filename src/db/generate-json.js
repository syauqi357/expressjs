import fs from "fs";
import path from "path";
import pool from "./indexdb.js";

const OUTPUT_DIR = "src/data";
const AYAT_DIR = `${OUTPUT_DIR}/ayat`;

// bikin folder kalo belum ada
fs.mkdirSync(AYAT_DIR, { recursive: true });

try {
  // 1. generate surah.json
  const [surahRows] = await pool.query("SELECT * FROM surah ORDER BY id");
  fs.writeFileSync(
    path.resolve(`${OUTPUT_DIR}/surah.json`),
    JSON.stringify(surahRows, null, 2),
    "utf-8"
  );
  console.log("✓ surah.json generated");

  // 2. generate ayat per surah (1.json, 2.json, ...)
  for (const surah of surahRows) {
    const [ayatRows] = await pool.query(
      `SELECT q.*, s.namaLatin, s.namaArab, s.namaIndo, s.tempatTurun
       FROM quran_id q
       JOIN surah s ON q.suraId = s.id
       WHERE q.suraId = ?
       ORDER BY q.verseID`,
      [surah.id]
    );

    fs.writeFileSync(
      path.resolve(`${AYAT_DIR}/${surah.id}.json`),
      JSON.stringify(ayatRows, null, 2),
      "utf-8"
    );

    console.log(`✓ ayat/${surah.id}.json — ${surah.namaLatin} (${ayatRows.length} ayat)`);
  }

  console.log("\n✅ Semua JSON berhasil digenerate!");
} catch (err) {
  console.error("Error:", err.message);
}

await pool.end();