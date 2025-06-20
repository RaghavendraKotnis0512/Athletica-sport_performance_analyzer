// import express from 'express';
// import { analyzeImage } from '../controllers/ratingController.js';
// import { analyzeImageCricket } from '../controllers/ratingControllerCricket.js';

// const router = express.Router();

// // POST /api/rate
// router.post('/', async (req, res) => {
//   try {
//     const result = await analyzeImage(req, res);
//     // Assuming analyzeImage sends response itself,
//     // otherwise you can send response here:
//     // res.json(result);
//   } catch (error) {
//     console.error('Error in analyzeImage:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
// router.post('/cricket', async (req, res) => {
//   try {
//     const result = await analyzeImageCricket(req, res);
//   } catch (error) {
//     console.error('Error in analyzeImage:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// export default router;

import express from 'express';
import multer from 'multer';
import { analyzeImage } from '../controllers/ratingController.js';
import { analyzeImageCricket } from '../controllers/ratingControllerCricket.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('image'), async (req, res) => {
  console.log('\n====== Incoming Request ======');
  console.log('Headers:', req.headers);
  console.log('BODY:', req.body);
  console.log('FILE:', req.file);
  console.log('==============================\n');

  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded.' });
  }

  const sport = req.body.sport?.toLowerCase();

  if (!sport) {
    return res.status(400).json({ error: 'Sport not specified in form data.' });
  }

  try {
    if (sport === 'tennis') {
      console.log('Running tennis image analyzer...');
      await analyzeImage(req, res);
    } else if (sport === 'cricket') {
      console.log('Running cricket image analyzer...');
      await analyzeImageCricket(req, res);
    } else {
      return res.status(400).json({ error: 'Unsupported sport selected.' });
    }
  } catch (error) {
    console.error('❌ ERROR inside analyzeImage:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
