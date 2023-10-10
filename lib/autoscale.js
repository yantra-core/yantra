
import config from '../config/config.js';
import axios from 'axios';

async function autoscale (region, owner, worldId) {
  console.log('autoscale', region, owner, worldId)

  // use client scoped etherspaceEndpoint if available
  let etherspaceEndpoint = this.etherspaceEndpoint || config.etherspaceEndpoint;

  let url = etherspaceEndpoint + `/api/v1/autoscale/${region}/${worldId}`; // is that correct? where is owner?
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

    if (typeof gameData === 'undefined') {
      let msg = `${owner}/${worldId} ` + `was not found. You must first call sdk.createWorld("${worldId}", worldConfig)`;
      console.log(msg);
      throw new Error(msg);
    }

    console.log('attempting to autoscale game...', region, owner, worldId);
    await sleep(1000);
    return autoscale(region, owner, worldId);
  }
  
  
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export default autoscale;