import fs from 'fs';
import path from 'path';
import https from 'https';

const downloadFile = (url: string, dest: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Ensure directory exists
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
         return downloadFile(response.headers.location as string, dest).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

async function main() {
  console.log('Downloading Quran data...');
  // Download standard simple Quran JSON structure
  await downloadFile('https://raw.githubusercontent.com/risan/quran-json/main/data/quran.json', './public/data/quran_ar.json');
  console.log('Quran downloaded.');

  // Download backgrounds (Free high-quality images)
  const backgrounds = [
    { url: 'https://images.unsplash.com/photo-1597466599360-1b700b0f0a11?auto=format&fit=crop&w=1920&q=80', name: 'makka.jpg' }, // Kaaba
    { url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1920&q=80', name: 'madina.jpg' }, // Medina mosque
    { url: 'https://images.unsplash.com/photo-1519817914152-2a241f6e520d?auto=format&fit=crop&w=1920&q=80', name: 'mosque.jpg' }, // General Mosque
    { url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80', name: 'nature.jpg' }, // Nature
    { url: 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&w=1920&q=80', name: 'night-sky.jpg' } // Stars
  ];

  for (const bg of backgrounds) {
    try {
      console.log(`Downloading background ${bg.name}...`);
      await downloadFile(bg.url, `./public/backgrounds/${bg.name}`);
    } catch (e) {
      console.error(`Failed to download ${bg.name}:`, e);
    }
  }

  // Download Recitations (Al-Fatiha for sample offline support to respect sizes)
  console.log('Downloading audio files...');
  // Alafasy - Al Fatiha (001001 to 001007)
  const ayahs = ['001001', '001002', '001003', '001004', '001005', '001006', '001007'];
  for (const ayah of ayahs) {
    const url = `https://everyayah.com/data/Alafasy_128kbps/${ayah}.mp3`;
    try {
      await downloadFile(url, `./public/recitations/alafasy_${ayah}.mp3`);
    } catch (e) {
       console.error(`Failed to download audio ${ayah}:`, e);
    }
  }

  console.log('Setup complete!');
}

main().catch(console.error);
