import express from 'express';
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TARGET_DATE = new Date('2025-12-31T23:59:59Z');
const WIDTH = 400;
const HEIGHT = 60;
// Register your font
GlobalFonts.registerFromPath(
  path.join(__dirname, 'fonts', 'Arial.ttf'),
  'Arial'
);

const app = express();
const port = process.env.PORT || 3000;
app.get('/countdown', (req, res) => {
  const now = new Date();
  let diff = TARGET_DATE - now;
  if (diff < 0) diff = 0;

  const totalSeconds = Math.floor(diff / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    '0'
  );
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  const text = `Timer for promocode: ${hours}h:${minutes}m:${seconds}s`;

  // Create a temporary canvas to measure text width
  const tempCanvas = createCanvas(0, 0);
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.font = '22px Arial';
  const textMetrics = tempCtx.measureText(text);
  const textWidth = textMetrics.width;

  // Add some padding
  const canvasWidth = Math.ceil(textWidth + 40); // 20px padding each side
  const canvasHeight = HEIGHT;

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  // Background transparent
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Draw text
  ctx.font = '22px Arial';
  ctx.fillStyle = '#ffffff';
  const textY = canvasHeight / 2 + 8;
  ctx.fillText(text, 20, textY);

  res.set('Content-Type', 'image/png');
  res.send(canvas.toBuffer('image/png'));
});

app.listen(port, () => console.log(`Server running on port ${port}`));
