import config from '../../config/config.js';
import axios from 'axios';

let getWorld = async function getWorld (owner, worldId, worldConfig) {

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
  console.log('GET', url);

  let result = await axios.get(url, {
    headers: headers
  });
  // console.log('Found World Config:', result.data); // TODO: sort keys by preference
  
  return result.data;
}

export default getWorld;