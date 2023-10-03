import onServerMessage from './lib/core/onServerMessage.js';
import createWorld from './lib/createWorld.js';
import create from './lib/state/create.js';
import autoscale from './lib/autoscale.js';
import applyForce from './lib/state/applyForce.js';
import setVelocity from './lib/state/setVelocity.js';
import update from './lib/state/update.js';
import ws from 'ws';

const sdk = {};

sdk.createClient = function createClient(options) {
  return new YantraClient(options);
}

function YantraClient(options) {
  let self = this;
  this.options = options || {};
  this.serverConnection = null;
  this.connectAttempts = 0;
  this.connected = false;
  this.region = 'Washington_DC';
  this.world = {};
  this.cache = {};

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
YantraClient.prototype.create = create;
YantraClient.prototype.onServerMessage = onServerMessage;
YantraClient.prototype.autoscale = autoscale;
YantraClient.prototype.applyForce = applyForce;
YantraClient.prototype.setVelocity = setVelocity;
YantraClient.prototype.update = update;

YantraClient.prototype.connect = async function (worldId) {

  let wsConnectionString;
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
  
    // return this;

  });


};

YantraClient.prototype.disconnect = function () {
  if (this.serverConnection) {
    console.log('disconnecting...');
    this.serverConnection.close();
    this.connected = false;

  }

  return this;
};

YantraClient.prototype.sendJSON = function (json) {
  if (this.serverConnection) {
    this.serverConnection.send(JSON.stringify(json));
  }
  return this;
}

YantraClient.prototype.createWorld = createWorld;

YantraClient.prototype._onOpen = function (wsConnectionString) {
  this.connectAttempts = 0;
  this.connected = true;
  console.log('WebSocket connection opened ' + wsConnectionString);
  // serverSettings.paused = false;
  this.emit('open');
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

YantraClient.prototype.on = function (event, fn) {
  this.events[event] = this.events[event] || [];
  this.events[event].push(fn);
}

YantraClient.prototype.emit = function (event, data) {
  if (this.events[event]) {
    this.events[event].forEach(function (fn) {
      fn(data);
    });
  }
}

export default sdk;
