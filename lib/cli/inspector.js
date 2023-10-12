// Blessed CLI Gamestate Inspect WIP
// Close to MVP operational, needs a bit more UX work on loading and selecting entities

import yantra from '@yantra-core/sdk/sdk.js';
import blessed from 'blessed';

const inspector = {};


inspector.startBlessed = function() {
  this.screen = blessed.screen({
    smartCSR: true,
    title: 'Game State Viewer',
  });

  this.consoleBox = this.createConsoleBox();  // Create the console box
  this.screen.append(this.consoleBox);  // Append the console box to the screen

  this.createColumns();
  this.setupKeyBindings();
  this.setupEventListeners();

  this.column1.focus();
  this.screen.render();
};

inspector.createConsoleBox = function() {
  return blessed.box({
    top: '69%',  // Position the box at the bottom 20% of the screen
    left: 0,
    width: '100%',
    height: '33%',
    border: { type: 'line' },
    scrollable: true,
    keys: true,
    mouse: true,
  });
};

inspector.createColumns = function() {
  this.column1 = this.createListColumn(0, '33%');
  this.column2 = this.createListColumn('33%', '34%');
  this.column3 = this.createBoxColumn('67%', '33%');



  this.column1.on('focus', () => {
    this.column1.style.border.fg = 'yellow';  // Choose a high-visibility color
    this.screen.render();
  });

  this.column1.on('blur', () => {
    this.column1.style.border.fg = 'green';  // Revert to the original color
    this.screen.render();
  });

  this.column2.on('focus', () => {
    this.column2.style.border.fg = 'yellow';  // Choose a high-visibility color
    this.screen.render();
  });

  this.column2.on('blur', () => {
    this.column2.style.border.fg = 'green';  // Revert to the original color
    this.screen.render();
  });


  this.column3.on('focus', () => {
    this.column3.style.border.fg = 'yellow';  // Choose a high-visibility color
    this.screen.render();
  });

  this.column3.on('blur', () => {
    this.column3.style.border.fg = 'green';  // Revert to the original color
    this.screen.render();
  });


  this.screen.append(this.column1);
  this.screen.append(this.column2);
  this.screen.append(this.column3);




  
};

let columnHeight = '63%';
let columnTop = '8%';

inspector.createListColumn = function(left, width) {
  return blessed.list({
    top: columnTop,
    left: left,
    width: width,
    height: columnHeight,
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
    top: columnTop,
    left: left,
    width: width,
    height: columnHeight,
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
  this.column1.on('keypress', (ch, key) => {
    try {
      if (key.name === 'up' || key.name === 'down') {
        const index = this.column1.selected;
        // Set the items for column2 based on the selected item in column1
        this.column2.setItems(this.formattedData.entities[this.formattedData.collections[index]]);
        
        // Optionally, focus on column2
        // this.column2.focus();
      }
    } catch (err) {
      console.log(err);
    }
  });

  this.column2.on('select', (item, index) => {
    try {
      const selectedEntity = this.formattedData.entities[this.formattedData.collections[this.column1.selected]][index];
      const properties = this.formattedData.properties[selectedEntity];
      let propertiesText = '';
      for (let prop in properties) {
        propertiesText += `${prop}: ${properties[prop]}\n`;
      }
      this.column3.setContent(propertiesText);
    } catch (err) {
      console.log(err);
    }
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
  
  this.screen.render();  // Render every 33 game ticks

};


inspector.subscribeToGamestate = async function (worldId) {
  this.client = yantra.createClient({
    logger: blessedLogger
    // logger: function noop () {} // replace to silence, default is console.log
  });
  this.client.on('gamestate', (data) => {
    // console.log(this.client.cache)
    inspector.handleGamestate(this.client.cache);
  });
  await this.client.connect(worldId);
};


// Initialize the inspector
//inspector.startBlessed();
//inspector.subscribeToGamestate();


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

inspector.start = function startInspector (worldId) {
  inspector.mode = worldId;
  inspector.startBlessed();
  inspector.subscribeToGamestate(worldId);


  inspector.createHeader = function() {
    return blessed.box({
      top: 0,
      left: 0,
      width: '100%',
      height: '8%',  // Adjust the height to your liking
      content: `YANTRA GAMESTATE INSPECTOR: ${inspector.client.owner}/${inspector.mode} `,
      align: 'center',
      border: { type: 'line' },
      style: {
        fg: 'white',
        bg: 'blue',  // Change background color to your liking
        border: { fg: 'white' },
      }
    });
  };

  this.header = inspector.createHeader();  // Create the header box
  this.screen.append(this.header);  // Append the header box to the screen

}

let blessedLogger = function blessedLogger (...args) {
  // Convert the arguments to a string
  const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' ');

  // Append the message to the consoleBox
  //inspector.consoleBox.setContent(`${inspector.consoleBox.getContent()}\n${message}`);
  inspector.consoleBox.insertBottom(message);


  // Scroll to the bottom of the consoleBox
  inspector.consoleBox.setScrollPerc(100);

  // Optionally, you may want to keep the original console.log behavior as well
  // originalConsoleLog(...args);

  // Ensure the screen is rendered again to show the new log message
  inspector.screen.render();
};

export default inspector;