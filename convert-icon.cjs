const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const toIco = require('to-ico');

async function convertPngToIco() {
  const pngPath = path.join(__dirname, 'public', 'system-logo.png');
  const icoPath = path.join(__dirname, 'public', 'icon.ico');
  
  try {
    // Resize PNG to 256x256 and ensure proper format
    const resizedBuffer = await sharp(pngPath)
      .resize(256, 256, { fit: 'contain', background: '#ffffff' })
      .png()
      .toBuffer();
    
    // Convert to ICO
    const icoBuffer = await toIco([resizedBuffer]);
    fs.writeFileSync(icoPath, icoBuffer);
    console.log('✓ Icon converted successfully:', icoPath, `(${(icoBuffer.length / 1024).toFixed(2)} KB)`);
  } catch (err) {
    console.error('Error converting icon:', err.message);
  }
}

convertPngToIco();
