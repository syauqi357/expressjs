import { Router } from "express";
import pool from "../db/indexdb.js";
import { json } from "body-parser";

const router = Router()

router.get("/surah", async(req,res)=>{
   const [rows] = await pool.query(
      "SELECT DISTINCT suraId FROM quran_id ORDER BY suraId"
   );
   res.json(rows);
});

router.get("/surah/:suraId", async(req,res)=>{
   const [rows] = await pool.query(
      "SELECT * FROM quran_id WHERE suraId = ? ORDER BY verseId"
   );
   res.json(rows);
});

router.get("/surah/:suraId/ayat/:verseId", async(req,res)=> {
   const [rows] = await pool.query(
      "SELECT * FROM quran_id WHERE suraId = ? AND verseId = ?",
    [req.params.suraId, req.params.verseId]
   )
   if (rows.length===0) return res.status(404).json({message:"tidak di temukan"})
      res.json(rows[0]);
})
