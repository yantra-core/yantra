const deltaUpdate = {};

const _cache = {};

let intProperties = ['x', 'y', 'health', 'energy', 'score', 'kills', 'height', 'width'];

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

//
// Integer values are sent as delta-only updates from the server
// This means the first value recieved to the client is the origin value,
// and all subsequent values are the difference between the origin and the current value.
// Client values *must* be updated with the difference, not the absolute value
// The server is intelligent enough to only send the difference between the origin and the current value.
// This technique is used to minimize the amount of data sent over the wire.
//
deltaUpdate.inflate = function deltaInflate (thingy) {

  if (typeof typeMap[thingy.type] === 'undefined') {
    // console.log('no delta update required for', thingy.type)
    return;
  }

  // console.log('deltaInflate', thingy)

  let _cachedThing = _cache[typeMap[thingy.type]][thingy.id];
  if (_cachedThing) {

    intProperties.forEach((prop) => {
      // check to see that incoming thing value is defined and a number
      if (typeof thingy[prop] !== 'undefined' && typeof thingy[prop] === 'number') {
        thingy[prop] = _cachedThing[prop] + thingy[prop];
      }
    });
    /*
    thingy.rotation = _cachedThing.rotation + thingy.rotation;
    thingy.health = _cachedThing.health + thingy.health;
    thingy.energy = _cachedThing.energy + thingy.energy;
    thingy.score = _cachedThing.score + thingy.score;
    thingy.kills = _cachedThing.kills + thingy.kills;
    thingy.height = _cachedThing.height + thingy.height;
    thingy.width = _cachedThing.width + thingy.width;
    */

    _cachedThing.x = thingy.x;
    _cachedThing.y = thingy.y;
    _cachedThing.rotation = thingy.rotation;
    _cachedThing.health = thingy.health;
    _cachedThing.energy = thingy.energy;
    _cachedThing.score = thingy.score;
    _cachedThing.kills = thingy.kills;
    _cachedThing.height = thingy.height;
    _cachedThing.width = thingy.width;

    _cache[typeMap[thingy.type]][thingy.id] = _cachedThing;

    if (typeof _cachedThing.faction !== 'undefined') {
      thingy.faction = _cachedThing.faction;
    }

  }

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