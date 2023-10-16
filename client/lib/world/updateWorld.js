import config from '../../config/config.js';
import axios from 'axios';

let updateWorld = async function updateWorld (owner, worldId, worldConfig) {

  // Define the headers you want to add to the request.
  const headers = {
    'yantra-token': this.accessToken
  };

  let etherspaceEndpoint = this.etherspaceEndpoint || config.etherspaceEndpoint;
  let url = etherspaceEndpoint + `/api/v1/worlds/${owner}/${worldId}/update`;
  console.log('updateWorld', url, worldConfig)
  this.worldConfig = {
    room: worldConfig
  };

  let result = await axios.post(url, worldConfig, {
    headers: headers
  });
  if (result.data && typeof result.data.error !== 'undefined') {
    throw new Error(`${owner}/${worldId} ` + result.data.error);
  }

  return result.data;
}

export default updateWorld;