import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// SVG content for the icon
const iconSvg = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="108" fill="#FF6B2C"/>
  <g fill="white">
    <rect x="230" y="80" width="36" height="352" rx="10"/>
    <rect x="140" y="120" width="200" height="36" rx="10"/>
    <rect x="140" y="240" width="180" height="36" rx="10"/>
    <rect x="140" y="360" width="200" height="36" rx="10"/>
    <rect x="140" y="120" width="36" height="276" rx="10"/>
    <rect x="304" y="156" width="36" height="88" rx="18"/>
    <rect x="304" y="276" width="36" height="88" rx="18"/>
  </g>
</svg>`;

const smallIconSvg = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="6" fill="#FF6B2C"/>
  <g fill="white">
    <rect x="14" y="5" width="2" height="22" rx="1"/>
    <rect x="9" y="7" width="12" height="2" rx="1"/>
    <rect x="9" y="15" width="11" height="2" rx="1"/>
    <rect x="9" y="23" width="12" height="2" rx="1"/>
    <rect x="9" y="7" width="2" height="18" rx="1"/>
    <rect x="19" y="9" width="2" height="6" rx="1"/>
    <rect x="19" y="17" width="2" height="6" rx="1"/>
  </g>
</svg>`;

async function generateIcons() {
  try {
    // Generate favicon.png (32x32)
    await sharp(Buffer.from(smallIconSvg))
      .png()
      .toFile(join(publicDir, 'favicon.png'));
    console.log('Generated favicon.png (32x32)');

    // Generate apple-touch-icon.png (180x180)
    await sharp(Buffer.from(iconSvg))
      .resize(180, 180)
      .png()
      .toFile(join(publicDir, 'apple-touch-icon.png'));
    console.log('Generated apple-touch-icon.png (180x180)');

    // Generate icon-192.png for PWA
    await sharp(Buffer.from(iconSvg))
      .resize(192, 192)
      .png()
      .toFile(join(publicDir, 'icon-192.png'));
    console.log('Generated icon-192.png');

    // Generate icon-512.png for PWA
    await sharp(Buffer.from(iconSvg))
      .resize(512, 512)
      .png()
      .toFile(join(publicDir, 'icon-512.png'));
    console.log('Generated icon-512.png');

    // Generate favicon.ico (multi-size: 16, 32, 48)
    const sizes = [16, 32, 48];
    const pngBuffers = await Promise.all(
      sizes.map(size =>
        sharp(Buffer.from(smallIconSvg))
          .resize(size, size)
          .png()
          .toBuffer()
      )
    );

    // Simple ICO format (just use 32x32 PNG)
    const png32 = await sharp(Buffer.from(smallIconSvg))
      .resize(32, 32)
      .png()
      .toBuffer();

    // ICO header
    const icoHeader = Buffer.alloc(6);
    icoHeader.writeUInt16LE(0, 0); // Reserved
    icoHeader.writeUInt16LE(1, 2); // Type (1 = ICO)
    icoHeader.writeUInt16LE(1, 4); // Number of images

    // ICO directory entry
    const icoDir = Buffer.alloc(16);
    icoDir.writeUInt8(32, 0);  // Width
    icoDir.writeUInt8(32, 1);  // Height
    icoDir.writeUInt8(0, 2);   // Color palette
    icoDir.writeUInt8(0, 3);   // Reserved
    icoDir.writeUInt16LE(1, 4);  // Color planes
    icoDir.writeUInt16LE(32, 6); // Bits per pixel
    icoDir.writeUInt32LE(png32.length, 8); // Size of image data
    icoDir.writeUInt32LE(22, 12); // Offset (6 header + 16 dir = 22)

    // Combine into ICO file
    const ico = Buffer.concat([icoHeader, icoDir, png32]);
    writeFileSync(join(publicDir, 'favicon.ico'), ico);
    console.log('Generated favicon.ico');

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
