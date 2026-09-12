const fs = require('fs');
const path = require('path');

const outputFile = 'C:/Users/omen/.gemini/antigravity/brain/d8ccea0c-8d45-41c9-9e6f-ea6ad8ea9ed1/.system_generated/steps/1114/output.txt';
const raw = fs.readFileSync(outputFile, 'utf8');

// The output is a markdown-wrapped json or json
let jsonStr = '';
const match = raw.match(/\{[\s\S]*\}/);
if (match) {
  jsonStr = match[0];
} else {
  console.error('Could not parse JSON from output');
  process.exit(1);
}

const data = JSON.parse(jsonStr);
const publicDir = path.join(__dirname, 'public');

const buf32 = Buffer.from(data.b64_32, 'base64');
const buf64 = Buffer.from(data.b64_64, 'base64');
const buf180 = Buffer.from(data.b64_180, 'base64');
const buf512 = Buffer.from(data.b64_512, 'base64');

fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), buf32);
fs.writeFileSync(path.join(publicDir, 'favicon-64x64.png'), buf64);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), buf180);
fs.writeFileSync(path.join(publicDir, 'favicon.png'), buf512);

// Create valid ICO file containing 32x32 PNG
// ICO header: 6 bytes
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // Reserved
header.writeUInt16LE(1, 2); // Image type: 1 = ICO
header.writeUInt16LE(1, 4); // Number of images

// Directory entry: 16 bytes
const entry = Buffer.alloc(16);
entry.writeUInt8(32, 0);  // Width
entry.writeUInt8(32, 1);  // Height
entry.writeUInt8(0, 2);   // Color palette
entry.writeUInt8(0, 3);   // Reserved
entry.writeUInt16LE(1, 4); // Color planes
entry.writeUInt16LE(32, 6); // Bits per pixel
entry.writeUInt32LE(buf32.length, 8); // Image size in bytes
entry.writeUInt32LE(22, 12); // Offset to image data (6 + 16 = 22)

const icoBuffer = Buffer.concat([header, entry, buf32]);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);

// Create self-contained SVG favicon with #E4DCCD background
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#E4DCCD"/>
  <image href="data:image/png;base64,${data.b64_512}" width="512" height="512"/>
</svg>
`;
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent);

console.log('Successfully generated all favicon assets:');
console.log('- favicon-32x32.png:', buf32.length, 'bytes');
console.log('- favicon-64x64.png:', buf64.length, 'bytes');
console.log('- favicon.png:', buf512.length, 'bytes');
console.log('- apple-touch-icon.png:', buf180.length, 'bytes');
console.log('- favicon.ico:', icoBuffer.length, 'bytes');
console.log('- favicon.svg:', svgContent.length, 'bytes');
