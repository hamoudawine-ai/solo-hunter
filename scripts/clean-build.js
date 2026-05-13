import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dirsToRemove = ['dist', 'dist_electron'];

for (const dirName of dirsToRemove) {
  const target = path.join(__dirname, '..', dirName);
  if (fs.existsSync(target)) {
    try {
      fs.rmSync(target, { recursive: true, force: true });
      console.log(`Removed ${target}`);
    } catch (error) {
      console.warn(`Could not remove ${target}: ${error.code || error.message}. Continuing build.`);
    }
  } else {
    console.log(`Nothing to remove at ${target}`);
  }
}
