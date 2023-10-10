import config from '../../config/config.js';
import axios from 'axios';

let updateWorld = async function updateWorld (owner, worldId, worldConfig) {
  if (typeof this.owner !== 'undefined') { // TODO: remove
    owner = this.owner;
  }
  let etherspaceEndpoint = this.etherspaceEndpoint || config.etherspaceEndpoint;
  let url = etherspaceEndpoint + `/api/v1/worlds/${owner}/${worldId}/update`;
  console.log('updateWorld', url, worldConfig)
  this.worldConfig = {
    room: worldConfig
  };

  let result = await axios.post(url, worldConfig);
  if (result.data && typeof result.data.error !== 'undefined') {
    throw new Error(`${owner}/${worldId} ` + result.data.error);
  }

  return result.data;
}

export default updateWorld;