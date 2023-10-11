# `@yantra-core/sdk`

The `@yantra-core/sdk` is a client-side SDK for interfacing with the Yantra serverless physics platform. With this SDK, you can create, manage, and interact with dynamic physics environments. Below is a guide on how to use it.

<img src="https://yantra.gg/img/yantra-logo-med.png"/>
Install SDK and run `yantra login` for a free account

## Installation

Install the SDK via npm:

```bash
npm install -g @yantra-core/sdk
```

## Features

- **Create Client**: Generate a new instance of `YantraClient`
- **World Management**: Connect to, or disconnect from, specific worlds.
- **Entity Management**: Create and update entities in the physics world.
- **Physics Interactions**: Apply forces, set velocities, and modify other physics-related attributes of entities.
- **Event Handling**: React to various events and server messages.
- **World Deployment**: Deploy physics world to cloud
- **Auto-scaling**: Automatically scale resources for a given world in a specific region.


## CLI Quick Start

**Login / Register Account**

*Login with existing account name or register new account by email address*
```bash
yantra login
```

**Initialize and a new World**

*Installs base template for World development and deployment*
```bash
mkdir my-world
cd my-world
yantra init
```

**Clone existing Yantra World**

*Installs a pre-made World into current directory. Type `yantra clone` to view available Worlds*
```bash
yantra clone pong
cd pong
npm start
```

**Deploy World from localhost to cloud**

*Deploys local world to Yantra Cloud. Provides a default game client link via ayyo.gg*
```bash
yantra clone snake
cd snake
yantra deploy
```

## SDK Usage

### Importing the Node SDK

```javascript
import sdk from '@yantra-core/sdk';
```

### Importing the Browser SDK

```javascript
import sdk from '@yantra-core/sdk/sdk-browser.js';
```

### Creating a Yantra Client
*Basic Client Usage*
```javascript
const client = sdk.createClient({
  owner: 'your_name',
  region: 'Washington_DC' // see https://yantra.gg/docs#regions
});
```

### Connecting to a World

Using `worldId`. Will take a few seconds to boot if world is inactive.

```javascript
await client.connect('my-world');
```


### Interacting with Entities

Creating an entity:

```javascript
client.create(initialState);
```

Updating an entity:

```javascript
client.update(entityId, newState);
```

Applying force:

```javascript
client.applyForce(entityId, forceObject);
```

Setting velocity:

```javascript
client.setVelocity(entityId, velocityObject);
```

### Listening to Events

Events: `error`, `collision`, `gamestate`

```javascript
client.on('collision', data => {
  console.log('Received event:', data);
})
client.on('gamestate', function(snapshot){
  console.log(snapshot)
});
client.on('error', console.error);
```

### Autoscaling

Games will autoscale based on `maxPlayers` settings and active connected players. When an instance is approaching `maxPlayers`, a new game instance will be created to help distribute the load.

### Disconnecting

```javascript
client.disconnect();
```

### Sending JSON to Server

The Yantra API is designed to accept and distribute state changes as JSON arrays. If you wish to use a more low-level API for managing state you may call `client.sendJSON`.

```javascript
client.sendJSON({ 
  event: 'creator_json',
  ayyoKey: 'YOUR_API_KEY',
  json: { state: [YOUR_STATE_ARRAY] } 
});
```


# Building your Game on Yantra

## Quick Start

### In-Browser Development:
- **Editor**: Use our browser-based Monaco Editor.
- **Run**: Click "Run" to test your code against our servers.
- **Save**: Click "Save" to store your code in our database.

### Local Development:
- Import the `@yantra-core/sdk` in your code.
- Your game logic subscribes to the game state. Modify the state in response to each tick for dynamic gameplay.

## Important:

- **No External Dependencies**: Your code should run without requiring any external libraries or packages.
- **SDK Connection**: When on our servers, `@yantra-core/sdk` auto-connects to the right localhost and port.


## Running in Yantra's Environment:

When you upload your code to Yantra, it's executed in our optimized low-latency environment. Here's what you should know:

- **High Performance**: Yantra's backend is fine-tuned to ensure your game logic runs smoothly.
- **Consistent Framerate**: We prioritize a consistent, high framerate, ensuring your gameplay is fluid and responsive.
- **Direct Execution**: Your uploaded code runs directly, 1:1, with no modifications or external dependencies. The performance you see locally will mirror what you get in our cloud environment.



## Support

For issues, bugs, or feedback, please [open an issue on our GitHub repository](https://github.com/yantra-core/sdk) or visit us in our [Discord](https://discord.gg/MWyfw5xVHH)

---
