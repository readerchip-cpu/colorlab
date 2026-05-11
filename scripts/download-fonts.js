const https = require('https');
const fs = require('fs');
const path = require('path');

const FONTS_DIR = path.join(__dirname, '..', 'public', 'fonts');

const BASE = 'https://raw.githubusercontent.com/orioncactus/pretendard/main/packages/pretendard/dist/public/static';

const FONTS = [
  { name: 'Pretendard-Regular.otf', url: `${BASE}/Pretendard-Regular.otf` },
  { name: 'Pretendard-Bold.otf',    url: `${BASE}/Pretendard-Bold.otf` },
  { name: 'Pretendard-Light.otf',   url: `${BASE}/Pretendard-Light.otf` },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    function get(targetUrl) {
      https.get(targetUrl, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          get(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlink(dest, () => {});
          reject(new Error(`Failed: ${targetUrl} → HTTP ${res.statusCode}`));
          return;
        }
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
      }).on('error', (err) => {
        file.close();
        fs.unlink(dest, () => {});
        reject(err);
      });
    }

    get(url);
  });
}

async function main() {
  if (!fs.existsSync(FONTS_DIR)) {
    fs.mkdirSync(FONTS_DIR, { recursive: true });
  }

  for (const font of FONTS) {
    const dest = path.join(FONTS_DIR, font.name);
    if (fs.existsSync(dest)) {
      console.log(`  skip  ${font.name} (already exists)`);
      continue;
    }
    process.stdout.write(`  downloading ${font.name}...`);
    await download(font.url, dest);
    console.log(' done');
  }

  console.log('\nAll fonts ready in public/fonts/');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
