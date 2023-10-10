import config from '../../config/config.js';
import axios from 'axios';

async function listWorlds(owner) {

  let etherspaceEndpoint = this.etherspaceEndpoint || config.etherspaceEndpoint;
  let url = etherspaceEndpoint + `/api/v1/worlds/${owner}`;
  console.log('list worlds', url)
  let result = await axios.get(url);
  return result.data;

}
export default listWorlds;