import express from 'express';
import { analyzeImage } from '../controllers/ratingController.js';

const router = express.Router();

// POST /api/rate
router.post('/', async (req, res) => {
  try {
    const result = await analyzeImage(req, res);
    // Assuming analyzeImage sends response itself,
    // otherwise you can send response here:
    // res.json(result);
  } catch (error) {
    console.error('Error in analyzeImage:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
