import config from '../../config/config.js';
import axios from 'axios';

let removeWorld = async function removeWorld (owner, worldId) {
  if (typeof this.owner !== 'undefined') { // TODO: remove
    owner = this.owner;
  }
  let etherspaceEndpoint = config.etherspaceEndpoint;
  let url = etherspaceEndpoint + `/api/v1/worlds/${owner}/${worldId}/remove`;
  console.log('removeWorld', url)
  let result = await axios.post(url);
  if (result.data && typeof result.data.error !== 'undefined') {
    console.log(`${owner}/${worldId} ` + result.data.error);
  }

  return result.data;
}

export default removeWorld;