import config from '../config/config.js';

import axios from 'axios';

async function autoscale (region, owner, worldId) {
  // this.log('autoscale', region, owner, worldId)

  let accessToken = this.accessToken || config.accessToken;

  // use client scoped etherspaceEndpoint if available
  let etherspaceEndpoint = this.etherspaceEndpoint || config.etherspaceEndpoint;

  // Define the headers you want to add to the request.
  const headers = {
    'yantra-token': this.accessToken
  };

  let url = etherspaceEndpoint + `/api/v1/autoscale/${region}/${owner}/${worldId}`;
  this.log('POST', url)
  let result = await axios.post(url, {
    owner: owner
  }, {
    headers: headers
  });

  let gameData = result.data[0];
  // this.log('gameData', gameData);

  if (typeof gameData === 'object' && typeof gameData.processInfo === 'object' && typeof gameData.processInfo.wsConnectionString === 'string') {
    // server is online and ready, return result.data
    return result.data;
  } else {

    if (typeof gameData === 'undefined') {
      let msg = `${owner}/${worldId} ` + `was not found. You must first call sdk.createWorld("${worldId}", worldConfig)`;
      this.log(msg);
      throw new Error(msg);
    }

    this.log('attempting to autoscale game...', region, owner, worldId);
    await sleep(1000);
    return this.autoscale(region, owner, worldId);
  }
  
  
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export default autoscale;