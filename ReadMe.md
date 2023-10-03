# `@yantra-core/sdk`

The `@yantra-core/sdk` is a client-side SDK for interfacing with the Yantra serverless physics platform. With this SDK, you can create, manage, and interact with dynamic physics environments. Below is a guide on how to use it.

<img src="https://yantra.gg/img/yantra-logo.png"/>
Visit: https://yantra.gg for a free account

## Installation

Install the SDK via npm:

```bash
npm install @yantra-core/sdk
```

## Features

- **Create Client**: Generate a new instance of `YantraClient`
- **World Management**: Connect to, or disconnect from, specific worlds.
- **Entity Management**: Create and update entities in the physics world.
- **Physics Interactions**: Apply forces, set velocities, and modify other physics-related attributes of entities.
- **Event Handling**: React to various events and server messages.
- **Auto-scaling**: Automatically scale resources for a given world in a specific region.

## Usage

### Importing the SDK

```javascript
import sdk from '@yantra-core/sdk';
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

## Support

For issues, bugs, or feedback, please [open an issue on our GitHub repository](https://github.com/yantra-core/sdk) or visit us in our [Discord](https://discord.gg/MWyfw5xVHH)

---