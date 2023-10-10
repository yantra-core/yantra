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

  let etherspaceEndpoint = this.etherspaceEndpoint || config.etherspaceEndpoint;
  let url = etherspaceEndpoint + `/api/v1/worlds/${owner}/${worldId}`;
  console.log('getting world', url);  
  let result = await axios.get(url);
  console.log('got world', result.data)
  
  return result.data;
}

export default getWorld;