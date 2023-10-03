// TODO: move config
import config from '../../config/config.js';
import axios from 'axios';
const etherspace = {};

etherspace.createWorld = async function createWorld (worldId, worldConfig) {
  let etherspaceEndpoint = config.etherspaceEndpoint;
  let url = etherspaceEndpoint + `/api/v1/worlds/${worldId}`;
  console.log('createWorld', url)
  let result = await axios.post(etherspaceEndpoint, worldConfig);
  return result;
}

export default etherspace;