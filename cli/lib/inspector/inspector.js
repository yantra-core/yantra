// Blessed CLI Gamestate Inspect WIP
// Close to MVP operational, needs a bit more UX work on loading and selecting entities

import yantra from '@yantra-core/client';
import blessed from 'blessed';

import createColumns from './createColumns.js';
import createConsoleBox from './createConsoleBox.js';
import onServerMessage from './onServerMessage.js';

import bindEvents from './bindEvents.js';
import bindKeys from './bindKeys.js';

const inspector = {};

inspector.startBlessed = function() {
  this.screen = blessed.screen({
    smartCSR: true,
    title: 'Game State Viewer',
  });

  this.consoleBox = createConsoleBox();  // Create the console box
  this.screen.append(this.consoleBox);  // Append the console box to the screen

  createColumns(this);

  bindKeys(this);
  bindEvents(this);

  this.column1.focus();
  this.screen.render();
};

inspector.subscribeToGamestate = async function (worldId) {
  let self = this;
  this.client = yantra.createClient({
    logger: blessedLogger
    // logger: function noop () {} // replace to silence, default is console.log
  });
  this.client.on('gamestate', (snapshot) => {
    // console.log(this.client.cache)
    // console.log(self.client.cache)
    onServerMessage(self, snapshot);
  });
  await this.client.connect(worldId);
  // this.client.welcomeLink(this.client.owner, worldId);
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