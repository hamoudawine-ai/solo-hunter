import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const latestYmlPath = path.join(__dirname, '..', 'latest.yml');

try {
  // Read the latest.yml file
  const content = fs.readFileSync(latestYmlPath, 'utf8');

  // Parse YAML
  const data = yaml.parse(content);

  // Convert SHA512 hashes to lowercase
  if (data.sha512) {
    data.sha512 = data.sha512.toLowerCase();
    console.log('Converted main sha512 to lowercase');
  }

  if (data.files && Array.isArray(data.files)) {
    data.files.forEach((file, index) => {
      if (file.sha512) {
        file.sha512 = file.sha512.toLowerCase();
        console.log(`Converted file ${index} sha512 to lowercase`);
      }
    });
  }

  // Write back the modified YAML
  const newContent = yaml.stringify(data);
  fs.writeFileSync(latestYmlPath, newContent, 'utf8');

  console.log('Successfully converted SHA512 hashes to lowercase in latest.yml');
} catch (error) {
  console.error('Error processing latest.yml:', error.message);
  process.exit(1);
}