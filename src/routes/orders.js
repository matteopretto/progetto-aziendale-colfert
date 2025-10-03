import express from "express";
const router = express.Router();

export default function ordersRoutes(db) {
  // GET /orders?dataInizio=YYYY-MM-DD&dataFine=YYYY-MM-DD&stato=...
  router.get("/", async (req, res) => {
    const { dataInizio, dataFine, stato, sort } = req.query;

    let query = "SELECT * FROM orders WHERE 1=1";
    const params = [];

    if (dataInizio) {
      query += " AND data >= ?";
      params.push(dataInizio);
    }

    if (dataFine) {
      query += " AND data <= ?";
      params.push(dataFine);
    }

    if (stato && stato !== "") {
      query += " AND stato = ?";
      params.push(stato);
    }

    switch (sort) {
    case "data-asc":
        query += " ORDER BY data ASC";
        break;
    case "data-desc":
        query += " ORDER BY data DESC";
        break;
    case "valore-asc":
        query += " ORDER BY valore ASC";
        break;
    case "valore-desc":
        query += " ORDER BY valore DESC";
        break;
    default:
        query += " ORDER BY data DESC";
}
console.log("Eseguendo query:", query, "con parametri:", params);

    try {
    
      const rows = await db.all(query, params);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
