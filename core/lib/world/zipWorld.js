import path from 'path';
import fs from 'fs';
import axios from 'axios';
import archiver from 'archiver';
import config from '../../../config/config.js';
import FormData from 'form-data';
import ProgressBar from 'cli-progress';

const excludes = ['node_modules', '.git', '.DS_Store'];

function zipWorld(source, out, excludes) {

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

export default zipWorld;