-- Tambahin foreign key di quran_id
ALTER TABLE quran_id
ADD CONSTRAINT fk_sura
FOREIGN KEY (suraId) REFERENCES surah(id);