import config from '../../../config/config.js';
import axios from 'axios';

async function listWorlds(owner) {

  // Define the headers you want to add to the request.
  const headers = {
    'yantra-token': this.accessToken
  };

  let etherspaceEndpoint = this.etherspaceEndpoint || config.etherspaceEndpoint;
  let url = etherspaceEndpoint + `/api/v1/worlds/${owner}`;
  console.log('GET', url);
  let result = await axios.get(url, {
    headers: headers
  });
  return result.data;

}
export default listWorlds;