import config from '../../config/config.js';
import axios from 'axios';

let createWorld = async function createWorld (owner, worldId, worldConfig) {

  // curry arguments if owner was not provided, assume current owner
  if (typeof worldConfig === 'undefined' && typeof worldId === 'object') {
    worldId = owner;
    owner = this.owner;
    worldConfig = worldId;
  }

  if (typeof this.owner !== 'undefined') { // TODO: remove
    owner = this.owner;
  }

  // Define the headers you want to add to the request.
  const headers = {
    'yantra-token': this.accessToken
  };

  let etherspaceEndpoint = this.etherspaceEndpoint || config.etherspaceEndpoint;
  let url = etherspaceEndpoint + `/api/v1/worlds/${owner}/${worldId}`;
  this.worldConfig = {
    room: worldConfig
  };

  let result = await axios.post(url, worldConfig, {
    headers: headers
  });
  if (result.data && typeof result.data.error !== 'undefined') {
    // throw new Error(`${owner}/${worldId} ` + result.data.error);
  }

  return result.data;
}

export default createWorld;