import onServerMessage from './lib/core/onServerMessage.js';
import createWorld from './lib/world/createWorld.js';
import removeWorld from './lib/world/removeWorld.js';
import create from './lib/state/create.js';
import set from './lib/state/set.js';
import destroy from './lib/state/destroy.js';
import autoscale from './lib/autoscale.js';
import applyForce from './lib/state/applyForce.js';
import setVelocity from './lib/state/setVelocity.js';
import update from './lib/state/update.js';
import clearAll from './lib/state/clearAll.js';
import setConfig from './lib/state/setConfig.js';
import listWorlds from './lib/world/listWorlds.js';
import setWorld from './lib/world/setWorld.js';
import getWorld from './lib/world/getWorld.js';
import updateWorld from './lib/world/updateWorld.js';
import minimist from 'minimist';

import ws from 'ws';
import path from 'path';


/**
 * Creates and returns a new YantraClient instance.
 *
 * @function
 * @param {Object} options - Configuration options for the client.
 * @param {function} [options.onServerMessage] - Callback function to handle server messages.
 * @param {string} [options.owner='AYYO-ALPHA-0'] - Identifier for the owner of the client.
 * @param {string} [options.region] - The region for the client.
 * @param {boolean} [options.worker=false] - Flag indicating whether to use a worker.
 * @returns {YantraClient} - A new YantraClient instance.
 */

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
    // this.owner = 'AYYO-ALPHA-0';
    console.log('Warning: No owner found.');
    console.log('Please run `yantra login` to login or register to your account')
  }

  if (options.region) {
    this.region = options.region;
  }

  if (options.etherspaceEndpoint) {
    this.etherspaceEndpoint = options.etherspaceEndpoint;
  }

  if (options.worldConfig) {
    this.worldConfig = options.worldConfig;
  }

  if (options.logger) {
    this.log = options.logger;
  } else {
    this.log = console.log;
  }

  if (options.accessToken) {
    this.accessToken = options.accessToken;
  }
  if (options.worker) {
    this.useWorker = true;
    this.worker = new Worker('./worker.js');
    this.worker.onmessage = function (e) {
      // run the default onServerMessage function on all messages
      let snapshot = self.onServerMessage(e.data);
      // if the optional onServerMessage callback is defined, call it
      if (this._onServerMessage) {
        this._onServerMessage(snapshot);
      }
    };
  } else {
    this.useWorker = false;
  }

}

YantraClient.prototype.emitGamestateEvents = function emitGamestateEvents (snapshot) {
  let self = this;
  // iterates through entire incoming gamestate array and checks for EVENT_MESSAGE
  snapshot.state.forEach(function iterateStates(state){

    //
    // PLAYER MOVEMENT / CONTROL INPUT EVENTS
    //
    if (state.type === 'PLAYER' && typeof state.controls === 'object' && Object.keys(state.controls).length > 0) {
      // console.log('input event emit it', state);
      self.emit('input', state);
    }

    //
    // PLAYER_JOINED / PLAYER_LEFT events
    //
    if (state.type === 'EVENT_MESSAGE' && state.kind === 'PLAYER_JOINED') {
      // This is bound to YantraClient.on('PLAYER_JOINED')
      self.emit('PLAYER_JOINED', {
        id: state.nickname, // should be state.target
        type: 'PLAYER'
      });
    }

    if (state.type === 'EVENT_MESSAGE' && state.kind === 'PLAYER_LEFT') {
      // This is bound to YantraClient.on('PLAYER_JOINED')
      self.emit('PLAYER_LEFT', {
        id: state.nickname, // should be state.target
        type: 'PLAYER'
      });
    }

    //
    // COLLISION EVENTS
    //
    if (state.type === 'EVENT_COLLISION') {
      // This is bound to YantraClient.on('collision', fn)
      self.emit('collision', state);
    }

  });
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
YantraClient.prototype.set = set;
YantraClient.prototype.destroy = destroy;
YantraClient.prototype.config = setConfig;

/*
if (!inBrowser) {
}
*/

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
 *     this.log('Connected to the world:', client);
 *   })
 *   .catch(error => {
 *     console.error('Connection error:', error);
 *   });
 *
 * // Connect using an object with wsConnectionString property
 * client.connect({ wsConnectionString: 'wss://example.com' })
 *   .then(client => {
 *     this.log('Connected to the world:', client);
 *   })
 *   .catch(error => {
 *     console.error('Connection error:', error);
 *   });
 */
YantraClient.prototype.connect = async function (worldId) {
  let self = this;
  let wsConnectionString;

  let env = 'dev';

  // TODO: remove this from YantraClient class, no minimist required
  // Remark: `process.env.YANTRA_ENV` is set in production to override connect to local websocket server 
  //          This is to ensure low-latency, as the custom world code is run on the same host as the game server
  // Parse command-line arguments
  if (typeof process !== 'undefined') {
    const argv = minimist(process.argv.slice(2));

    // Check for the YANTRA_ENV value
    const yantraEnv = argv.env || 'prod'; // Default to 'prod' if not provided

    if (yantraEnv === 'cloud') {
      this.log('YantraClient Cloud Mode Detected. Connecting to local websocket server.');
      worldId = {
        wsConnectionString: 'ws://127.0.0.1'
      };
    }
  }

  if (typeof worldId === 'undefined') {
    throw new Error('worldId is required for YantraClient.connect(worldId)');
  }

  if (typeof worldId === 'object') {
    wsConnectionString = worldId.wsConnectionString;
  } else {
    // Call into autoscaler to discover the websocket connection string
    // This will either return an existing connection string, or create a new one
    let world = await this.autoscale(this.region, this.owner, worldId, env)
    this.worldConfig = world[0];
    this.log(world.length, 'server candidate(s) found');
    this.log('Using best available server:', JSON.stringify(this.worldConfig.processInfo, true, 2));
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
  this.log('connecting... ' + wsConnectionString);

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
        // this.log(snapshot)
        // run the optional preProcessing function on all messages
        // this is currently used to parse gamestate for events to emit
        if (snapshot && true) { // Remark: This could be configurable for performance
          self.emitGamestateEvents(snapshot);
        }
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
    this.log('disconnecting...');
    this.serverConnection.close();
    this.connected = false;
  }
  return this;
};

YantraClient.prototype.joinWorld = function () {
  this.sendJSON({ event: 'player_identified' });
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
  } else {
    this.log('WARNING: not connected to world, cannot send JSON');
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
  this.log('WebSocket connection opened! ' + wsConnectionString);
  // serverSettings.paused = false;
  this.emit('open');
  this.emit('connect', this);
};

YantraClient.prototype._onError = function (wsConnectionString) {
  this.log('WebSocket connection error' + wsConnectionString);
  this.emit('error');
};

YantraClient.prototype._onClose = function (wsConnectionString, event) {
  this.log('WebSocket connection closed ' + wsConnectionString);
  // snapshot.clear();
  // serverSettings.paused = true;
  this.connected = false;

  const { code, reason, wasClean } = event;

  if (false && !wasClean) {
    let msg = `Connection closed with unclean disconnect, code=${code} reason=${reason}`;
    this.log(msg);
    console.error(msg);
    setTimeout(() => {
      let msg = this.connectAttempts + ` attempting to reconnect...`;
      this.log(msg);
      this.log(msg);
      this.connect(wsConnectionString);
    }, 3333);
  }

  this.emit('close');
};

YantraClient.prototype.clearAllState = clearAll;

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
 *   this.log('Update event received:', data);
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

YantraClient.prototype.welcomeLink = function welcomeLink(owner, mode, env) {

  if (typeof env === 'undefined') {
    env = 'dev';
  }

  let headerStr = '--REMOTE ENVIRONMENT DETECTED--';
  let gameLink = `https://ayyo.gg/play?mode=${mode}&owner=${owner}`;

  if (env !== 'prod') {
    gameLink += `&env=${env}`;
  } else {
    headerStr = 'PRODUCTION ENVIRONMENT DETECTED';
  }

  this.log('\n');
  this.log('¢∞§ -------' + headerStr + '------ §∞¢');

  if (env === 'dev') {
    this.log('¢∞§  Your code will run locally, and send state  §∞¢');
    this.log('¢∞§  to the live AYYO server. This is for dev.   §∞¢');
    this.log('¢∞§                                              §∞¢');
    this.log('¢∞§  For production run `yantra deploy` and your §∞¢');
    this.log('¢∞§  code will run low-latency in the AYYO cloud §∞¢');
    this.log('¢∞§                                              §∞¢');
    this.log('¢∞§ ---------------- AYYO World ---------------- §∞¢');
  }

  this.log('¢∞§                                              §∞¢');
  this.log('');
  this.log(gameLink);
  this.log('');
  this.log('      This link will open the game in browser')
  this.log('¢∞§                                              §∞¢');
  this.log('¢∞§     Enjoy!                     Have fun!     §∞¢');
  this.log('¢∞§                                              §∞¢');
  this.log('¢∞§ ---------------- AYYO World ---------------- §∞¢');
  this.log('\n\n');
}

export default YantraClient;