// backend/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import loginRoutes from './routes/login.js';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rotte
app.use('/api', loginRoutes);

// Avvio server
app.listen(PORT, () => {
  console.log(`✅ Backend server in ascolto su http://localhost:${PORT}`);
});
