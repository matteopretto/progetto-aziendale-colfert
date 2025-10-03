import express from "express";
import { initDb } from "./db/initDb.js";
import ordersRoutes from "./routes/orders.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

initDb().then(db => {
  // Importa le rotte passando il db
  app.use("/orders", ordersRoutes(db));

  app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
  });
}).catch(err => console.error(err));
