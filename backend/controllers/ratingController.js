import fs from 'fs';
import fetch from 'node-fetch'; // For Node < 18

export const analyzeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const imagePath = req.file.path;
    const base64Image = fs.readFileSync(imagePath).toString('base64');

    const response = await fetch('https://serverless.roboflow.com/infer/workflows/athletica/detect-and-classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.ROBOFLOW_API_KEY,
        inputs: {
          image: { type: 'base64', value: base64Image }
        }
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Roboflow API error: ${response.status} - ${text}`);
    }

    const result = await response.json();
    fs.unlinkSync(imagePath); // Clean up

    const outputs = result?.outputs ?? [];
    let rating = 0;
    let shotType = 'Unknown';

    if (outputs.length > 0) {
      // Try classification predictions first
      let predictions =
        outputs[0]?.classification_predictions?.[0]?.predictions?.predictions;

      // Fallback to detection predictions
      if (!predictions || predictions.length === 0) {
        predictions = outputs[0]?.detection_predictions?.predictions ?? [];
      }

      if (predictions && predictions.length > 0) {
        const totalConfidence = predictions.reduce((sum, p) => sum + (p.confidence ?? 0), 0);
        rating = Math.round((totalConfidence / predictions.length) * 100);
        shotType = predictions[0]?.class ?? 'Unknown';
      } else {
        console.log('No predictions found.');
      }
    } else {
      console.log('No outputs found.');
    }

    res.json({ rating, shotType, result });

  } catch (error) {
    console.error('Analysis failed:', error.message);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to analyze image', details: error.message });
  }
};
