import stateArraySchema from './stateSchema.js';
import Float2Int from './Float2Int.js';
import deltaUpdate from "./deltaUpdate.js";

let propertyNames = ['owner', 'nickname', 'type', 'texture', 'faction', 'id', 'x', 'y', 'width', 'height', 'radius', 'rotation', 'mass', 'health', 'energy', 'duration', 'velocityX', 'velocityY', 'fillColor', 'kills', 'score', 'brain', 'maxHealth', 'maxEnergy', 'damage', 'energyRegenRate', 'healthRegenRate', 'thrust', 'rotationSpeed', 'modifiers', 'kind', 'text'];
let floatyIntTypes = ['x', 'y', 'width', 'height', 'radius', 'rotation', 'velocity', 'mass', 'health', 'energy', 'duration', 'velocityX', 'velocityY', 'maxHealth', 'maxEnergy', 'damage', 'energyRegenRate', 'healthRegenRate', 'thrust', 'rotationSpeed'];
let inBrowser = false;

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
          console.log(msg);
          //logs.add(msg, 'error');
          let reason = 'Reason: ' + invalidState.reason;
          console.log(reason)
          //logs.add(reason, 'error')
        });
        console.log(data.data.invalidStates);
      }
    }
    return;
  }


  if (typeof data.snapshot.destroyQueue !== 'undefined') {
    data.snapshot.destroyQueue.forEach(function (state) {
      // console.log('performing local delete based on destroyQueue', state)
      if (typeof world[state.type] === 'object') {
        delete world[state.type][state.id];
      }
      deltaUpdate.remove(state);
      delete self.cache[state.id];
    });
  }

  let decodedPlayerState = [];

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

    fixStrings(encodedThing, thing);

    deltaUpdate.inflate(thing);

    if (typeof encodedThing.controls !== 'undefined' && Array.isArray(encodedThing.controls)) {
      thing.controls = {};
      encodedThing.controls.forEach(function (controlKey) {
        thing.controls[controlKey] = true;
      });
    }

    // recursive states are sparing used and not intended for heavy use in the game engine
    // in most cases it will be better to use multiple single state object without recursion
    // we currently use recursive states to store collision pairs for EVENT_COLLISION
    if (typeof encodedThing.states !== 'undefined' && encodedThing.states !== null && encodedThing.states.length > 0) {
      thing.states = [];
      encodedThing.states.forEach(function (subThing, i) {
        // Remark: Recursive states are partially hydrated and not fully inflated with delta compression
        //         Float compression is required for data to travel over the wire
        //         Delta compression is not used on recursive states, since it's a one-time event
        let _subThing = {};
        fixStrings(subThing, _subThing);
        _subThing.utime = new Date().getTime();
        _subThing.velocityX = Float2Int.decode(subThing.velocityX);
        _subThing.velocityY = Float2Int.decode(subThing.velocityY);
        _subThing.score = Float2Int.decode(subThing.score);
        _subThing.health = Float2Int.decode(subThing.health);
        _subThing.energy = Float2Int.decode(subThing.energy);
        thing.states.push(_subThing);
      })
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

    // the intent is to keep a fresh `cache` locally that always has
    // the most recent up to date information about the remote state

    // first, check to see if the local cache has never seen this object before, cache miss
    if (typeof self.cache[thing.id] !== 'object') {
      // since we have never seen this object before, copy the entire thing
      thing.ctime = new Date().getTime();
      self.cache[thing.id] = thing;
    } else {
      // the local cache *has* seen this before, cache hit
      // take the incoming thing and copy over any properties that are not undefined
      for (let prop in thing) {

        if (prop == 'controls') {
          self.cache[thing.id][prop] = thing[prop];
        }

        if (
          (typeof thing[prop] !== 'undefined' && thing[prop] !== null) &&
          (typeof thing[prop] !== 'number' || (typeof thing[prop] === 'number' && !isNaN(thing[prop]))
          )) {
          self.cache[thing.id][prop] = thing[prop];
        }

      }
      // since the thing will be used later in processing, we must copy it back
      thing = self.cache[thing.id];
    }


    if (typeof world[thing.type][thing.id] === 'undefined') {
      world[thing.type][thing.id] = {};
    }

    for (let key in thing) {
      let val = thing[key];
      if (val !== null && typeof val !== 'undefined' && val.toString() !== 'NaN') { // TODO remove NaN check
        world[thing.type][thing.id][key] = val;
      }
    }

    if (typeof thing.controls === 'undefined') {
      // easier to write code against API if this is always defined
      thing.controls = {};
    }

    currentState.push(thing);
  });

  let cachedArray = [];
  for (let key in self.cache) {
    cachedArray.push(self.cache[key]);
  }
  // need to determine semantic here if we want to only emit deltaa
  // or if we want to emit the full state
  // perhaps two events, one for delta and one for full state is best
  self.emit('gamestate', {
    gameTick: data.snapshot.id,
    state: currentState // could also be cachedArray 
  });

  snapshot.state = currentState;
  snapshot.invalidStates = data.snapshot.invalidStates;

  // now that the current snapshot has emitted and presumed to be processing,
  // the last known buffered creator_json states and send them to the server
  self.pushStateCache.forEach(function (json) {
    self.serverConnection.send(JSON.stringify(json));
  });

  self.pushStateCache = [];

  return snapshot;

}

function fixStrings(encodedThing, thing) {
  // TODO: remove charArrays, they should be handled by avro and returned as strings
  // See: https://github.com/mtth/avsc/issues/116
  let charArrays = ['owner', 'faction', 'id', 'nickname', 'kind'];
  for (let i = 0; i < propertyNames.length; i++) {
    let key = propertyNames[i];
    // dont iterate over prototype
    if (floatyIntTypes.indexOf(key) !== -1 && typeof encodedThing[key] !== 'undefined' && encodedThing[key] !== null) {
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
}

export default onServerMessage;