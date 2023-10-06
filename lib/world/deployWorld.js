import path from 'path';
import fs from 'fs';
import axios from 'axios';
import archiver from 'archiver';
import config from '../../config/config.js';
import FormData from 'form-data';
const excludes = ['node_modules', '.git', '.DS_Store'];

async function deployWorld(worldId, appPath) {
  // Get the absolute file path based on appPath
  const absolutePath = path.resolve(appPath);

  // Ensure the output directory exists
  const outputDir = path.resolve('./temp/worlds/');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Define the absolute output file path
  const outputFilePath = path.resolve(outputDir, `${worldId}.zip`);

  console.log(absolutePath, outputFilePath);
  await zipDirectory(absolutePath, outputFilePath, excludes);

  const formData = new FormData();
  const zipStream = fs.createReadStream(outputFilePath);
  formData.append('worldZip', zipStream, `${worldId}.zip`);

  const url = config.etherspaceEndpoint + `/api/v1/worlds/${worldId}/deploy`;
  console.log('POSTING to ', url);

  await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  console.log('deployWorld', worldId, appPath);

  console.log('deployWorld', worldId, appPath);
}

function zipDirectory(source, out, excludes) {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false, (entryData) => {
        // Check if the entry (file/folder) should be excluded
        for (const excludeItem of excludes) {
          if (entryData.name.includes(excludeItem)) {
            return false;
          }
        }
        return entryData;
      })
      .on('error', err => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
}

export default deployWorld;
