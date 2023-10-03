
import config from '../config/config.js';
import axios from 'axios';

async function autoscale (region, owner, worldId) {
  console.log('autoscale', region, owner, worldId)
  let etherspaceEndpoint = config.etherspaceEndpoint;

  let url = etherspaceEndpoint + `/api/v1/autoscale/${region}/${worldId}`
  console.log('autoscale endpoint', url)
  let result = await axios.post(url, {
    owner: owner
  });

  let gameData = result.data[0];
  console.log('gameData', gameData);

  if (typeof gameData === 'object' && typeof gameData.processInfo === 'object' && typeof gameData.processInfo.wsConnectionString === 'string') {
    // server is online and ready, return result.data
    return result.data;
  } else {
    console.log('attempting to autoscale game...');
    await sleep(1000);
    return autoscale(region, owner, worldId);
  }
  

  
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export default autoscale;