import { Router } from "express";
import pool from "../db/indexdb.js";

const router = Router();

// GET semua surah + jumlah ayat
router.get("/surah", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM surah ORDER BY id"
  );
  res.json(rows);
});

// GET ayat by surah — sekarang bisa JOIN
router.get("/surah/:suraId", async (req, res) => {
  const [rows] = await pool.query(`
    SELECT q.*, s.namaLatin, s.namaArab, s.namaIndo, s.tempatTurun
    FROM quran_id q
    JOIN surah s ON q.suraId = s.id
    WHERE q.suraId = ?
    ORDER BY q.verseId
  `, [req.params.suraId]);
  res.json(rows);
});

router.get("/surah/:suraId/ayat/:verseId", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM quran_id WHERE suraId = ? AND verseId = ?",
    [req.params.suraId, req.params.verseId],
  );
  if (rows.length === 0)
    return res.status(404).json({ message: "tidak di temukan" });
  res.json(rows[0]);
});

export default router;
