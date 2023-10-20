import config from '../config/config.js';

import axios from 'axios';

async function autoscale (region, owner, worldId, env) {
  // this.log('autoscale', region, owner, worldId)

  if (typeof owner === 'undefined') {
    let msg = 'Owner not found. Did you run `yantra login` first?';
    console.log(msg);
    throw new Error(msg);
  }

  this.log('autoscaling...', this.region + '/' + this.owner + '/' + worldId);

  if (typeof env === 'undefined') {
    env = 'prod';
  }

  let accessToken = this.accessToken || config.accessToken;

  // use client scoped etherspaceEndpoint if available
  let etherspaceEndpoint = this.etherspaceEndpoint || config.etherspaceEndpoint;

  // Define the headers you want to add to the request.
  const headers = {
    'yantra-token': this.accessToken
  };

  let url = etherspaceEndpoint + `/api/v1/autoscale/${region}/${owner}/${worldId}`;
  url += `?env=${env}`;
  this.log('POST', url)
  let result = await axios.post(url, {
    owner: owner,
    env: env
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

    this.log('attempting to autoscale game...', env, region, owner, worldId);
    await sleep(1000);
    return this.autoscale(region, owner, worldId, env);
  }
  
  
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export default autoscale;