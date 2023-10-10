import onServerMessage from './lib/core/onServerMessage.js';
import createWorld from './lib/world/createWorld.js';
import removeWorld from './lib/world/removeWorld.js';
import create from './lib/state/create.js';
import set from './lib/state/set.js';
import autoscale from './lib/autoscale.js';
import applyForce from './lib/state/applyForce.js';
import setVelocity from './lib/state/setVelocity.js';
import update from './lib/state/update.js';
import setConfig from './lib/state/setConfig.js';
import deployWorld from './lib/world/deployWorld.js';
import zipWorld from './lib/world/zipWorld.js';
import listWorlds from './lib/world/listWorlds.js';
import setWorld from './lib/world/setWorld.js';
import getWorld from './lib/world/getWorld.js';
import updateWorld from './lib/world/updateWorld.js';
import minimist from 'minimist';

import ws from 'ws';

import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tokenPath = path.resolve(__dirname + '/config/token.json');

let inBrowser = false;
if (typeof window !== 'undefined') {
  inBrowser = true;
}


/**
 * @namespace sdk
 */
const sdk = {};

/**
 * Creates and returns a new YantraClient instance.
 *
 * @function
 * @memberof sdk
 * @param {Object} options - Configuration options for the client.
 * @param {function} [options.onServerMessage] - Callback function to handle server messages.
 * @param {string} [options.owner='AYYO-ALPHA-0'] - Identifier for the owner of the client.
 * @param {string} [options.region] - The region for the client.
 * @param {boolean} [options.worker=false] - Flag indicating whether to use a worker.
 * @returns {YantraClient} - A new YantraClient instance.
 */
sdk.createClient = function createClient(options) {

  if (!inBrowser) {
    // load the contents of the token file pass in accessToken and owner name
    // TODO: add process.ENV.YANTRA_TOKEN support
    if (existsSync(tokenPath)) {
      const tokenContent = JSON.parse(readFileSync(tokenPath, 'utf-8'));
      options.accessToken = tokenContent.token;
      options.owner = tokenContent.account;
      console.log('found token.json file, using local settings', options.owner);
    } else {
      console.log(tokenPath, 'not found')
      //console.log('You are not currently logged in.');
      //console.log('Run `yantra login` to login to Yantra.');
    }
  }

  return new YantraClient(options);
}

/**
 * Represents a client for the Yantra serverless physics platform.
 *
 * @class
 * @param {Object} options - Configuration options for the Yantra client.
 * @param {function} [options.onServerMessage] - Callback function to handle server messages.
 * @param {string} [options.owner='AYYO-ALPHA-0'] - Identifier for the owner of the client.
 * @param {string} [options.region] - The region for the client.
 * @param {boolean} [options.worker=false] - Flag indicating whether to use a worker.
 */
function YantraClient(options) {
  let self = this;
  this.options = options || {};
  this.serverConnection = null;
  this.connectAttempts = 0;
  this.connected = false;
  this.region = 'Washington_DC';
  this.world = {};
  this.cache = {};
  this.pushStateCache = [];

  options.worker = false;

  if (options.onServerMessage) {
   this._onServerMessage = options.onServerMessage;
  }

  if (options.owner) {
    this.owner = options.owner;
  } else {
    this.owner = 'AYYO-ALPHA-0';
  }

  if (options.region) {
    this.region = options.region;
  }

  if (options.etherspaceEndpoint) {
    this.etherspaceEndpoint = options.etherspaceEndpoint;
  }

  if (options.accessToken) {
    this.accessToken = options.accessToken;
  }

  if (options.worker) {
    this.useWorker = true;
    this.worker = new Worker('./worker.js');
    this.worker.onmessage = function (e) {
      let snapshot = self.onServerMessage(e.data);
      if (this._onServerMessage) {
        this._onServerMessage(snapshot);
      }
    };
  } else {
    this.useWorker = false;
  }

}
YantraClient.prototype.onServerMessage = onServerMessage;

/**
 * Creates an entity with the provided state.
 *
 * @function
 * @memberof YantraClient
 * @param {Object} state - The initial state of the entity to be created.
 */
YantraClient.prototype.create = create; // currently acts as update / create, TODO: should throw error if id exists
// TODO: YantraClient.prototype.set(state) - acts as update / create, id optional
YantraClient.prototype.set = set;
YantraClient.prototype.config = setConfig;
YantraClient.prototype.deploy = deployWorld;
YantraClient.prototype.zip = zipWorld;
YantraClient.prototype.list = listWorlds;


/**
 * Updates the state of an entity identified by `bodyId`.
 *
 * @function
 * @memberof YantraClient
 * @param {string|number} bodyId - The identifier of the body/entity to update.
 * @param {Object} state - An object representing the new state of the entity.
 */
YantraClient.prototype.update = update;

/**
 * Asynchronously auto-scales resources within a specified region for a given world.
 *
 * @function
 * @async
 * @memberof YantraClient
 * @param {string} region - The region where resources should be auto-scaled.
 * @param {string} owner - The owner identifier for the resources.
 * @param {string|number} worldId - The identifier of the world to auto-scale resources for.
 * @returns {Promise<void>} - A promise that resolves when the autoscale operation is complete.
 */
YantraClient.prototype.autoscale = autoscale;

/**
 * Applies a specified force to an entity identified by `bodyId`.
 *
 * @function
 * @memberof YantraClient
 * @param {string|number} bodyId - The identifier of the body/entity to which the force is applied.
 * @param {Object} force - An object representing the force to be applied.
 */
YantraClient.prototype.applyForce = applyForce;

/**
 * Asynchronously sets the velocity of an entity identified by `bodyId`.
 *
 * @function
 * @memberof YantraClient
 * @param {string|number} bodyId - The identifier of the body/entity for which to set the velocity.
 * @param {Object} velocity - An object representing the velocity to be set.
 */
YantraClient.prototype.setVelocity = setVelocity;

/**
 * Assigns the `createWorld` function to the `YantraClient` prototype, making it available
 * to all instances of `YantraClient`. 
 *
 * The `createWorld` function is an asynchronous operation that manages 
 * the creation of a "world" in the Yantra serverless physics platform.
 * 
 * @function
 * @async
 * @memberof YantraClient
 * @instance
 * @param {(string|number)} worldId - A unique identifier intended for the new world.
 * @param {Object} worldConfig - An object containing configuration settings and properties for the new world.
 * 
 * @example
 * let worldId = "exampleWorld123";
 * let worldConfig = {
 *     property1: "value1",
 *     property2: "value2"
 *     // ... other world settings ...
 * };
 * 
 * let yantraClientInstance = new YantraClient(options);
 * yantraClientInstance.createWorld(worldId, worldConfig);
 */
YantraClient.prototype.createWorld = createWorld;
YantraClient.prototype.removeWorld = removeWorld;
YantraClient.prototype.setWorld = setWorld;
YantraClient.prototype.getWorld = getWorld;
YantraClient.prototype.updateWorld = updateWorld;

/**
 * Asynchronously establishes a connection to a specified world.
 *
 * @async
 * @function
 * @memberof YantraClient
 * @instance
 * @param {string|Object} worldId - The identifier of the world to connect to, or an object containing the WebSocket connection string.
 * @throws {Error} Throws an error if there's an issue establishing a WebSocket connection.
 * @returns {Promise<YantraClient>} Resolves with the `YantraClient` instance once connected, or rejects with an error if the connection fails.
 * @example
 * // Connect using a worldId string
 * client.connect('worldIdString')
 *   .then(client => {
 *     console.log('Connected to the world:', client);
 *   })
 *   .catch(error => {
 *     console.error('Connection error:', error);
 *   });
 *
 * // Connect using an object with wsConnectionString property
 * client.connect({ wsConnectionString: 'wss://example.com' })
 *   .then(client => {
 *     console.log('Connected to the world:', client);
 *   })
 *   .catch(error => {
 *     console.error('Connection error:', error);
 *   });
 */
YantraClient.prototype.connect = async function (worldId) {

  let wsConnectionString;

  // Remark: `process.env.YANTRA_ENV` is set in production to override connect to local websocket server 
  //          This is to ensure low-latency, as the custom world code is run on the same host as the game server
  // Parse command-line arguments
  const argv = minimist(process.argv.slice(2));

  // Check for the YANTRA_ENV value
  const yantraEnv = argv.env || 'prod'; // Default to 'prod' if not provided

  if (yantraEnv === 'cloud') {
    console.log('YantraClient Cloud Mode Detected. Connecting to local websocket server.');
    worldId = {
      wsConnectionString: 'ws://127.0.0.1:8888'
    };
  }

  if (typeof worldId === 'object') {
    wsConnectionString = worldId.wsConnectionString;
  } else {
    // needs to lookup worldId connection info from discovery server
    console.log('perform world lookup in db');
    // can we just straight into autoscale here?
    // does autoscale verify if mode and owner exists?
    console.log('calling autoscaler');
    let world = await this.autoscale(this.region, this.owner, worldId)
    console.log('wwww', world[0])
    this.worldConfig = world[0];


    if (this.worldConfig.processInfo.room) {
      this.worldConfig.room = this.worldConfig.processInfo.room; // legacy API
    } 

    wsConnectionString = world[0].processInfo.wsConnectionString;
  }
  this.connectAttempts++;

  if (this.serverConnection) {
    this.disconnect();
  }

  let apiToken = null;
  console.log('connecting... ' + wsConnectionString);


  return new Promise((resolve, reject) => {

    if (typeof window !== 'undefined') {
      this.serverConnection = new WebSocket(wsConnectionString);
    } else {
      this.serverConnection = new ws(wsConnectionString);
    }
  
  
    this.serverConnection.onopen = (event) => {
      this._onOpen.bind(this, wsConnectionString)(event);
      resolve(this); // Resolve the promise once the connection is opened
    };
    
    this.serverConnection.onerror = (event) => {
      this._onError.bind(this, wsConnectionString)(event);
      reject(new Error('WebSocket connection error')); // Reject the promise on error
    };
    
    this.serverConnection.onclose = this._onClose.bind(this, wsConnectionString);
  
    this.serverConnection.onmessage = function (msg) {
  
      if (this.useWorker) {
        this.worker.postMessage(msg.data);
      } else {
        let json = JSON.parse(msg.data);
        let snapshot = this.onServerMessage(json);
        // console.log(snapshot)
  
        if (this._onServerMessage) {
          this._onServerMessage(snapshot);
        }
      }
  
    }.bind(this);
  
    this.serverConnection.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    });
  
  });
};

/**
 * Disconnects the client from the current world if a connection exists.
 *
 * @function
 * @memberof YantraClient
 * @instance
 * @returns {YantraClient} - The `YantraClient` instance, allowing for method chaining.
 * @example
 * // Disconnect from the current world
 * client.disconnect();
 */
YantraClient.prototype.disconnect = function () {
  if (this.serverConnection) {
    console.log('disconnecting...');
    this.serverConnection.close();
    this.connected = false;
  }
  return this;
};

/**
 * Sends a JSON object to the connected server if a connection exists.
 *
 * @function
 * @memberof YantraClient
 * @instance
 * @param {Object} json - The JSON object to send to the server.
 * @returns {YantraClient} - The `YantraClient` instance, allowing for method chaining.
 * @example
 * // Send a JSON object to the server
 * client.sendJSON({ key: 'value' });
 */
YantraClient.prototype.sendJSON = function (json) {
  // if creator_json, reroute to sendState instead
  if (this.serverConnection) {
    if (json.event === 'creator_json') {
      this.pushStateCache.push(json);
    } else {
      this.serverConnection.send(JSON.stringify(json));
    }
  }
  return this;
}

// another approach is to not send creator_json until gamestate event /
// only send one creator_json per gamestate event
// that would ensure fixed order of creator_json and gamestate events
// similiar to sendJSON, but sends buffered state array
// buffers state for 1 ms, then sends
// this is to prevent sending state too often
YantraClient.prototype.sendState = function (json) {
  if (this.serverConnection) {
    this.serverConnection.send(JSON.stringify(json));
  }
  return this;
}


YantraClient.prototype._onOpen = function (wsConnectionString) {
  this.connectAttempts = 0;
  this.connected = true;
  console.log('WebSocket connection opened ' + wsConnectionString);
  // serverSettings.paused = false;
  this.emit('open');
  this.emit('connect', this);
};

YantraClient.prototype._onError = function (wsConnectionString) {
  console.log('WebSocket connection error' + wsConnectionString);
  this.emit('error');
};

YantraClient.prototype._onClose = function (wsConnectionString, event) {
  console.log('WebSocket connection closed ' + wsConnectionString);
  // snapshot.clear();
  // serverSettings.paused = true;
  this.connected = false;

  const { code, reason, wasClean } = event;

  if (false && !wasClean) {
    let msg = `Connection closed with unclean disconnect, code=${code} reason=${reason}`;
    console.log(msg);
    console.error(msg);
    setTimeout(() => {
      let msg = this.connectAttempts + ` attempting to reconnect...`;
      console.log(msg);
      console.log(msg);
      this.connect(wsConnectionString);
    }, 3333);
  }

  this.emit('close');
};

YantraClient.prototype.events = {};

/**
 * Registers an event listener for the specified event.
 *
 * @function
 * @memberof YantraClient
 * @instance
 * @param {string} event - The name of the event to listen for.
 * @param {function} fn - The callback function to execute when the event is emitted.
 * @example
 * // Register an event listener for the 'update' event.
 * client.on('update', function(data) {
 *   console.log('Update event received:', data);
 * });
 */
YantraClient.prototype.on = function (event, fn) {
  this.events[event] = this.events[event] || [];
  this.events[event].push(fn);
}

/**
 * Emits an event, causing all registered listeners for that event to be called.
 *
 * @function
 * @memberof YantraClient
 * @instance
 * @param {string} event - The name of the event to emit.
 * @param {*} [data] - The data to pass to the listeners of the event.
 * @example
 * // Emit an 'update' event with data.
 * client.emit('update', { key: 'value' });
 */
YantraClient.prototype.emit = function (event, data) {
  let self = this;
  if (this.events[event]) {
    this.events[event].forEach(function (fn) {
      fn.call(self, data);
    });
  }
}

export default sdk;