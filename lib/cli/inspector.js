// Blessed CLI Gamestate Inspect WIP
// Close to MVP operational, needs a bit more UX work on loading and selecting entities

import yantra from '@yantra-core/sdk';
import blessed from 'blessed';

const inspector = {};
inspector.gameTickCounter = 0;  // Initialize a game tick counter

inspector.startBlessed = function() {
  this.screen = blessed.screen({
    smartCSR: true,
    title: 'Game State Viewer',
  });

  this.createColumns();
  this.setupKeyBindings();
  this.setupEventListeners();


  this.column1.focus();
  this.screen.render();
};

inspector.createColumns = function() {
  this.column1 = this.createListColumn(0, '33%');
  this.column2 = this.createListColumn('33%', '34%');
  this.column3 = this.createBoxColumn('67%', '33%');

  this.screen.append(this.column1);
  this.screen.append(this.column2);
  this.screen.append(this.column3);
};

inspector.createListColumn = function(left, width) {
  return blessed.list({
    top: 0,
    left: left,
    width: width,
    height: '100%',
    border: { type: 'line' },
    style: {
      selected: { bg: 'green', fg: 'black' },  // Style for the selected row
      item: { bg: 'black', fg: 'white' },  // Style for other rows
      cursor: { bg: 'blue', fg: 'white' }  // Style for the cursor
    },
    keys: true,
    mouse: true,
  });
};


inspector.createBoxColumn = function(left, width) {
  return blessed.box({
    top: 0,
    left: left,
    width: width,
    height: '100%',
    border: { type: 'line' },
    scrollable: true,
    keys: true,
    mouse: true,
  });
};

inspector.setupKeyBindings = function() {
  this.screen.key(['escape', 'q', 'C-c'], (ch, key) => {
    return process.exit(0);
  });

  this.screen.key(['left', 'right'], (ch, key) => {
    const focusedColumnIndex = [this.column1, this.column2, this.column3].findIndex(column => column === this.screen.focused);
    const nextFocusedColumnIndex = key.name === 'right'
      ? (focusedColumnIndex + 1) % 3
      : (focusedColumnIndex + 2) % 3;

    const nextFocusedColumn = [this.column1, this.column2, this.column3][nextFocusedColumnIndex];
    nextFocusedColumn.focus();
  });
};

inspector.setupEventListeners = function() {
  this.column1.on('select', (item, index) => {
    // Set the items for column2 based on the selected item in column1
    this.column2.setItems(this.formattedData.entities[this.formattedData.collections[index]]);
    
    // Focus on column2 when an item in column1 is selected
    this.column2.focus();
  });

  this.column2.on('select', (item, index) => {
    const selectedEntity = this.formattedData.entities[this.formattedData.collections[this.column1.selected]][index];
    const properties = this.formattedData.properties[selectedEntity];
    let propertiesText = '';
    for (let prop in properties) {
      propertiesText += `${prop}: ${properties[prop]}\n`;
    }
    this.column3.setContent(propertiesText);
  });
};

inspector.handleGamestate = function(data) {
  this.formattedData = this.formatGameState(data);  // Store the formatted data
  this.column1.setItems(this.formattedData.collections);

  if (
    this.column1.selected !== undefined &&
    this.column2.selected !== undefined &&
    this.formattedData.collections[this.column1.selected] &&
    this.formattedData.entities[this.formattedData.collections[this.column1.selected]]
  ) {
    const selectedEntity = this.formattedData.entities[this.formattedData.collections[this.column1.selected]][this.column2.selected];
    const properties = this.formattedData.properties[selectedEntity];
    let propertiesText = '';
    for (let prop in properties) {
      propertiesText += `${prop}: ${properties[prop]}\n`;
    }
    this.column3.setContent(propertiesText);
  }
  
  this.gameTickCounter += 1;  // Increment the game tick counter
  if (this.gameTickCounter >= 33) {
    this.screen.render();  // Render every 33 game ticks
    this.gameTickCounter = 0;  // Reset the game tick counter
  }
};


inspector.subscribeToGamestate = async function() {
  this.client = yantra.createClient({});
  this.client.on('gamestate', (data) => {
    // console.log(this.client.cache)
    inspector.handleGamestate(this.client.cache);
  });
  await this.client.connect('MELEE_FFA');
};


// Initialize the inspector
inspector.startBlessed();
inspector.subscribeToGamestate();


inspector.formatGameState = function formatGameState(cache) {
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
};

inspector.startBlessed();
inspector.subscribeToGamestate();