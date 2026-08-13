// Geo-Track Cleanup Script
// This script removes unused files from the project

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToDelete = [
  'views/request_form.xian',
  'views/partials/head.xian',
  'views/partials/footer.xian',
  'public/tailwind.css'
];

console.log('🧹 Geo-Track Cleanup Script');
console.log('============================\n');

filesToDelete.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted: ${file}`);
    } else {
      console.log(`⚠️  Not found: ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error deleting ${file}:`, error.message);
  }
});

console.log('\n✨ Cleanup complete!');
