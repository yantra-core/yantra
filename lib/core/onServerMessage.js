import stateArraySchema from './stateSchema.js';
import Float2Int from './Float2Int.js';
import deltaUpdate from "./deltaUpdate.js";

let propertyNames = ['owner', 'nickname', 'type', 'texture', 'faction', 'id', 'x', 'y', 'width', 'height', 'radius', 'rotation', 'velocity', 'mass', 'health', 'energy', 'duration', 'velocityX', 'velocityY', 'fillColor', 'kills', 'score', 'brain', 'maxHealth', 'maxEnergy', 'damage', 'energyRegenRate', 'healthRegenRate', 'thrust', 'rotationSpeed', 'modifiers', 'kind'];
let floatyIntTypes = ['x', 'y', 'width', 'height', 'radius', 'rotation', 'velocity', 'mass', 'health', 'energy', 'duration', 'velocityX', 'velocityY', 'maxHealth', 'maxEnergy', 'damage', 'energyRegenRate', 'healthRegenRate', 'thrust', 'rotationSpeed'];

let onServerMessage = function onServerMessage(data) {
  let world = this.world;
  let self = this;
  let snapshot = {
    state: [],
    invalidStates: [],
    destroyQueue: data.destroyQueue
  };
  if (typeof data.snapshot === 'undefined') {
    // could be event: acceptedGame

    if (data.event === 'creatorLogs') {
      console.log('got back logs', data);

      if (data.data.invalidStates) {
        data.data.invalidStates.forEach(function (invalidState) {
          // create shallow copy without reason field
          let copy = Object.assign({}, invalidState);
          delete copy.reason;
          let msg = 'Invalid state:' + JSON.stringify(copy);
          logs.add(msg, 'error');
          let reason = 'Reason: ' + invalidState.reason;
          logs.add(reason, 'error')
        });
        console.log(data.data.invalidStates);
      }
    }
    return;
  }

  // console.log('onServerMessage', data.snapshot.state.data);

  let decodedPlayerState = [];
  let inBrowser = false;

  if (typeof window !== 'undefined') {
    inBrowser = true;
    decodedPlayerState = stateArraySchema.fromBuffer(data.snapshot.state.data);
  } else {
    inBrowser = false;
    decodedPlayerState = stateArraySchema.fromBuffer(Buffer.from(data.snapshot.state.data));
  }

  let currentState = [];
  decodedPlayerState.forEach(function (encodedThing) {

    let thing = {};
    thing.utime = new Date().getTime();

    // TODO: remove charArrays, they should be handled by avro and returned as strings
    // See: https://github.com/mtth/avsc/issues/116
    let charArrays = ['owner', 'faction', 'id', 'nickname', 'kind'];
    for (let i = 0; i < propertyNames.length; i++) {
      let key = propertyNames[i];
      //console.log('mapping key', key)
      // dont iterate over prototype
      if (floatyIntTypes.indexOf(key) !== -1 && typeof encodedThing[key] !== 'undefined' && encodedThing[key] !== null) {
        //console.log('f2i', encodedThing.id, key, encodedThing[key]);
        thing[key] = Float2Int.decode(encodedThing[key]);
      } else {
        if (inBrowser && charArrays.indexOf(key) !== -1 && typeof encodedThing[key] !== 'undefined' && encodedThing[key] !== null) {
          thing[key] = encodedThing[key].split(',');
          thing[key] = String.fromCharCode(...thing[key]);
        } else {
          if (encodedThing[key] !== null) {
            thing[key] = encodedThing[key];
          }
        }
      }
    }

    deltaUpdate.inflate(thing);

    if (thing.type === 'EVENT_COLLISION') {
      self.emit('collision', thing);
    }

    // temp hack for missing server duration property
    if (thing.type === 'BULLET') {
      // console.log('setting duration', 999)
      thing.duration = 3333;
    }

    if (thing.type === 'MISSILE') {
      // console.log('setting duration', 999)
      thing.duration = 15000;
    }

    // TODO: move this to more formal snapshot manager
    // import code from ayyo proper
    // we need to keep track of:
    // - all previous inflated states
    // - current incoming inflated state
    // - diff between current and previous states (for each thing)
    if (typeof world[thing.type] === 'undefined') {
      world[thing.type] = {};
    }

    // cache[thing.id] = thing;

    if (typeof world[thing.type][thing.id] === 'undefined') {
      world[thing.type][thing.id] = {};
    }

    for (let key in thing) {
      let val = thing[key];
      if (val !== null && typeof val !== 'undefined' && val.toString() !== 'NaN') { // TODO remove NaN check
        world[thing.type][thing.id][key] = val;
      }
    }

    currentState.push(thing);

  });

  self.emit('gamestate', {
    state: currentState
  });

  snapshot.state = currentState;
  snapshot.invalidStates = data.snapshot.invalidStates;

  return snapshot;

}

export default onServerMessage;