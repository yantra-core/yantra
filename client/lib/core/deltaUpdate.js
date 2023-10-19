const deltaUpdate = {};

const _cache = {};

let intProperties = ['x', 'y', 'velocityX', 'velocityY', 'health', 'energy', 'score', 'kills', 'height', 'width'];

let typeMap = {
  'HEXAPOD': 'Hexapods',
  'PLAYER': 'Players',
  'MINE': 'Mines',
  'QUEEN': 'Queens',
  'MISSILE': 'Missiles',
  'BOMB': 'Bombs',
  'DEFLECTOR': 'Deflectors',
  'LASER': 'Lasers',
  'TILE': 'Tiles',
  'BODY': 'Bodies'
};

for (let t in typeMap) {
  _cache[typeMap[t]] = {};
}

deltaUpdate.clear = function deltaClear () {
  for (let t in typeMap) {
    _cache[typeMap[t]] = {};
  }
}

deltaUpdate.remove = function deltaRemove (thingy) {
  if (typeof typeMap[thingy.type] === 'undefined') {
    return;
  }
  // console.log('removing', thingy.type, thingy.id);
  delete _cache[typeMap[thingy.type]][thingy.id];
}

//
// Integer values are sent as delta-only updates from the server
// This means the first value recieved to the client is the origin value,
// and all subsequent values are the difference between the origin and the current value.
// Client values *must* be updated with the difference, not the absolute value
// The server is intelligent enough to only send the difference between the origin and the current value.
// This technique is used to minimize the amount of data sent over the wire.
//
deltaUpdate.inflate = function deltaInflate(thingy) {

  // Exit early if there's no type mapping for thingy.type
  if (typeof typeMap[thingy.type] === 'undefined') {
    // console.log('no delta update required for', thingy.type)
    return;
  }

  // Retrieve the cached version of the incoming thingy
  let _cachedThing = _cache[typeMap[thingy.type]][thingy.id];

  // If a cached version exists, update the properties on the incoming thingy
  if (_cachedThing) {

    // Iterate through the properties to apply delta updates or copy from cache
    intProperties.forEach((prop) => {
      if (
        typeof thingy[prop] !== 'undefined' && 
        typeof thingy[prop] === 'number' && 
        typeof _cachedThing[prop] !== 'undefined'
      ) {
        // Apply delta update to the property value on thingy
        thingy[prop] = _cachedThing[prop] + thingy[prop];
        // set precision to 3 decimal places ( configurable )
        thingy[prop] = parseFloat(thingy[prop].toFixed(3));
      } else if (typeof _cachedThing[prop] !== 'undefined') {
        // Copy cached value to thingy if thingy[prop] is undefined
        thingy[prop] = _cachedThing[prop];
      }
    });

    // Update the cached version with the new values from thingy
    intProperties.forEach((prop) => {
      if (typeof thingy[prop] !== 'undefined') {
        _cachedThing[prop] = thingy[prop];
      }
    });

    // Update the cache with the new _cachedThing
    _cache[typeMap[thingy.type]][thingy.id] = _cachedThing;

  }

  // If there's no cached version, initialize the cache with the values from thingy
  if (typeof _cachedThing === 'undefined') {

    _cache[typeMap[thingy.type]][thingy.id] = {
      x: thingy.x,
      y: thingy.y,
      health: thingy.health,
      energy: thingy.energy,
      faction: thingy.faction,
      width: thingy.width,
      height: thingy.height,
      rotation: thingy.rotation,
      score: thingy.score,
      kills: thingy.kills,
      height: thingy.height,
      width: thingy.width
    };

  }

}

export default deltaUpdate;