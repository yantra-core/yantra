// formatGamestateCache takes in existing gamestate client.cache ( single level object )
// and formats / groups the data to render well in the inspector view
// this is meant for formatting `cache` from the gamestate event, not incoming gamestate data
// the `cache` data represents the entire world as seen by the client, not just the delta
function formatGamestateCache(cache) {

  // Initialize empty objects for grouped entities and formatted data
  const groupedEntities = {};
  const formattedData = {
    collections: [],
    entities: {},
    properties: {},
  };

  // Iterate over the key-value pairs in the cache object
  for (let id in cache) {
    const entity = cache[id];
    const type = entity.type;

    // If this type hasn't been seen before, initialize a new array for it
    if (!groupedEntities[type]) {
      groupedEntities[type] = [];
      formattedData.collections.push(type);  // Add the new type to the collections array
    }

    // Add this entity to the appropriate array in groupedEntities
    groupedEntities[type].push(entity);

    // Add this entity's properties to the properties object in formattedData
    formattedData.properties[id] = {
      id: entity.id,
      type: entity.type,
      x: entity.x.toFixed(2),
      y: entity.y.toFixed(2),
      width: entity.width.toFixed(2),
      height: entity.height.toFixed(2),
      //health: entity.health.toFixed(2),
    };
  }

  // Build the entities object in formattedData
  for (let type in groupedEntities) {
    formattedData.entities[type] = groupedEntities[type].map(entity => entity.id);
  }

  return formattedData;

}

export default formatGamestateCache;