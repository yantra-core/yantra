// setWorld acts as a createOrUpdateWorld function
// setWorld is a convenience function that will create a world with config if it doesn't exist,
// or update a world config if it does exist
// setWorld is the *recommended* way to create or update worlds
import config from '../../config/config.js';
import deepEquals from '../helpers/deepEquals.js';
import axios from 'axios';

let setWorld = async function setWorld (owner, worldId, worldConfig) {

  // curry arguments if owner was not provided, assume current owner
  if (typeof worldConfig === 'undefined' && typeof worldId === 'object') {
    let _config = worldId;
    worldId = owner;
    owner = this.owner;
    worldConfig = _config;
  }

  // console.log('setWorld', owner, worldId, worldConfig);

  // get the world first
  // console.log('getting world', owner + '/' + worldId)
  let world = await this.getWorld(owner, worldId);

  if (!world) {
    // world doesn't exist, create a new world with the config
    console.log('no existing world detected, creating new world with config', worldConfig)
    world = await this.createWorld(owner, worldId, worldConfig);
    console.log('created new world with config', owner, world, worldConfig);
  } else {
    console.log('Checking local world config against remote world config');
    // check current config and perform diff update if diff from local
    let diff = deepEquals(world, worldConfig);
    //console.log('world', world);
    //console.log('worldConfig', worldConfig)

    if (diff.equal) {
      console.log('No local config changes detected, skipping update');
    } else {
      console.log(world);
      console.log('Detected changes, going to update world with local config', worldConfig);
      console.log('diff', diff.changes);
      let updated = await this.updateWorld(owner, worldId, worldConfig);
      console.log("updated", updated);
    }

    // bind the worldConfig to instance scope for convenience
    this.worldConfig = {
      room: worldConfig
    };

  }

  return true;
}

export default setWorld;