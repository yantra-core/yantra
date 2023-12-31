import path from 'path';
import fs from 'fs';
import axios from 'axios';
import archiver from 'archiver';
import config from '../../config/config.js';
import FormData from 'form-data';
import ProgressBar from 'cli-progress';
import zipWorld from './zipWorld.js';

const progressBar = new ProgressBar.SingleBar({
    format: 'Uploading |' + '{bar}' + '| {percentage}% || {value}/{total} Chunks', // || Speed: {speed} <- wasn't displaying?
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
});

async function deployWorld(owner, worldId, appPath) {

    const absolutePath = path.resolve(appPath);
    const outputFilePath = path.resolve(`${worldId}.zip`);

    const formData = new FormData();
    const zipStream = fs.createReadStream(outputFilePath);

    formData.append('worldZip', zipStream, `${worldId}.zip`);

    const url = config.etherspaceEndpoint + `/api/v1/worlds/${owner}/${worldId}/deploy`;
    console.log('Uploading to:', url);

    progressBar.start(100, 0);

    let accessToken = this.accessToken || config.accessToken;

    await axios.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'yantra-token': accessToken
        },
        onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            progressBar.update(percentCompleted);
        }
    });

    progressBar.stop();

    console.log('Deployed world', worldId, 'from path', appPath);

    let gameLink = `https://yantra.gg/mantra/hathora?world=${worldId}&owner=${owner}`;
    console.log('AYYO World Link', gameLink);
}


export default deployWorld;