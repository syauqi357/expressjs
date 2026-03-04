import fs from 'fs'
import path from 'path'
import pool from './indexdb.js'

const sqlreadFile = fs.readFileSync(
   path.resolve("quran-indonesia-db/quran-indonesia.sql"),
   "utf-8"
);

const statements = sqlreadFile
.split(";")
.map((s) => s.trim)
.filter((s)=>s.length >0);

for (const statement of statements){
   await pool.query(statement);
}

console.log("seeding done");
await pool.end();