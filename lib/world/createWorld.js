// TODO: move config
import config from '../../config/config.js';
import axios from 'axios';

let createWorld = async function createWorld (worldId, worldConfig) {
  let etherspaceEndpoint = config.etherspaceEndpoint;
  let owner = 'Marak';
  let url = etherspaceEndpoint + `/api/v1/worlds/${owner}/${worldId}`;
  console.log('createWorld', url, worldConfig)
  this.worldConfig = {
    room: worldConfig
  };

  let result = await axios.post(url, worldConfig);
  if (result.data && typeof result.data.error !== 'undefined') {
    throw new Error(`${owner}/${worldId} ` + result.data.error);
  }

  return result;
}

export default createWorld;