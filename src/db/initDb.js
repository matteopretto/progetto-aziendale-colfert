import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db;

export async function initDb() {
  db = await open({
    filename: "src/db/dev.sqlite",
    driver: sqlite3.Database
  });

  // Creazione tabella ordini
  await db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      stato TEXT,
      valore REAL,
      persona TEXT,
      data TEXT,
      prodotto TEXT,
      quantita INTEGER
    );
  `);

  // Popolamento iniziale (solo se tabella vuota)
  const row = await db.get("SELECT COUNT(*) AS cnt FROM orders");
  if (row.cnt === 0) {
    await db.exec(`
      INSERT INTO orders (nome, stato, valore, persona, data, prodotto, quantita) VALUES
      ('Ordine #001','completato',190,'Marco','2025-10-02','Prodotto A',2),
      ('Ordine #002','in-lavorazione',120,'Luca','2025-09-30','Prodotto B',1),
      ('Ordine #003','annullato',200,'Sara','2025-09-29','Prodotto C',3),
      ('Ordine #004','completato',300,'Anna','2025-10-01','Prodotto D',4),
      ('Ordine #005','in-lavorazione',150,'Marco','2025-09-28','Prodotto E',2),
      ('Ordine #006','annullato',50,'Luca','2025-09-25','Prodotto F',1),
      ('Ordine #007','completato',400,'Sara','2025-10-03','Prodotto G',5),
      ('Ordine #008','in-lavorazione',250,'Anna','2025-09-27','Prodotto H',2);
    `);
  }

  console.log("DB inizializzato correttamente 😎");
  return db;
}
