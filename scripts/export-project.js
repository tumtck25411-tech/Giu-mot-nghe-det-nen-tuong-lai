const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = 'C:\\Users\\Cam Tu\\.gemini\\antigravity\\scratch\\det-nen-tuong-lai';
const outDir = 'C:\\Users\\Cam Tu\\.gemini\\antigravity\\scratch\\det-nen-tuong-lai-export';
const zipPathScratch = 'C:\\Users\\Cam Tu\\.gemini\\antigravity\\scratch\\det-nen-tuong-lai-source.zip';
const zipPathArtifact = 'C:\\Users\\Cam Tu\\.gemini\\antigravity\\brain\\5c203936-185a-4c89-8d5c-12a0b30dbd6c\\det-nen-tuong-lai-source.zip';

// Clean outDir if exists
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

const ignored = new Set(['node_modules', '.next', '.vercel', '.git']);

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    const base = path.basename(src);
    if (ignored.has(base)) return;
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      if (ignored.has(entry)) continue;
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Copying files to export folder...');
copyRecursive(srcDir, outDir);
console.log('Copied all source and asset files successfully.');

// Create Zip
console.log('Creating zip archive...');
const psScript = `Compress-Archive -Path '${outDir}\\*' -DestinationPath '${zipPathScratch}' -Force`;
execSync(`powershell -NoProfile -Command "${psScript}"`, { stdio: 'inherit' });

if (fs.existsSync(zipPathScratch)) {
  console.log('Created zip in scratch:', zipPathScratch);
  fs.copyFileSync(zipPathScratch, zipPathArtifact);
  console.log('Copied zip to artifact directory:', zipPathArtifact);
}
console.log('Export complete.');
