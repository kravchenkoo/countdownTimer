import express from 'express';
import { createCanvas } from '@napi-rs/canvas'; // or "canvas"

const app = express();
const PORT = 3000;

// ==== SET YOUR TARGET DATE HERE ====
const TARGET_DATE = new Date('2025-12-31T23:59:59Z');

// ==== IMAGE SETTINGS ====
const WIDTH = 450;
const HEIGHT = 60;
const FONT = '24px Arial'; // must be system-safe
const TEXT_COLOR = '#ffffff';
const BG_COLOR = 'rgba(0,0,0,0)'; // transparent background (good for emails)
// const BG_COLOR = "#1a1a1a"; // if you want solid

app.get('/countdown.png', (req, res) => {
  const now = new Date();
  let diff = TARGET_DATE - now;

  if (diff < 0) diff = 0;

  // Calculate remaining time
  const totalSeconds = Math.floor(diff / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    '0'
  );
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  const text = `Timer for promocode: ${hours}h:${minutes}m:${seconds}s`;

  // Generate canvas
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Font
  ctx.font = FONT;
  ctx.fillStyle = TEXT_COLOR;

  // Center text vertically
  const textMetrics = ctx.measureText(text);
  const textX = 20;
  const textY = HEIGHT / 2 + 10;

  ctx.fillText(text, textX, textY);

  // Output PNG
  res.set('Content-Type', 'image/png');
  res.send(canvas.toBuffer('image/png'));
});

app.listen(PORT, () => {
  console.log(`Countdown server running at http://localhost:${PORT}`);
});
