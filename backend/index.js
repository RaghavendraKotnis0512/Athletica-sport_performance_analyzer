import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import ratingRoutes from './routes/ratingRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 8080;
const upload = multer({ dest: 'uploads/' });

// Enable CORS **before** other middleware and routes
app.use(cors({
  origin: 'http://localhost:5173' // your frontend URL
}));

app.use(express.json());

// Mount routes
app.use('/api/rate', ratingRoutes);

app.get('/', (req, res) => res.send('Server is running'));

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
