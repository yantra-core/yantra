# Space Melee - Yantra Example World
<img src="https://yantra.gg/img/yantra-logo-med.png"/>
https://yantra.gg

This repository contains an example implementation of a space melee game using the Yantra serverless physics platform. The game is structured to run within the Yantra environment and showcases how to manage game state, player interactions, and various game configurations in a serverless physics world.

## Getting Started

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Run the game using `npm start`.

You may also run `yantra clone space-melee` to clone the game into the current working directory.

## File Structure

- `config.js`: Contains configuration settings for the game.
- `boot.js`: Sets up the Yantra client, registers event listeners, and connects to the Yantra server.
- `world.js`: Contains the main world logic, handles initialization, and game tick updates.

## World Logic

The world logic is contained within the `world.js` file which exports a `world` object with the following structure:

- `init(Y)`: Initializes the world, sets up a box entity.
- `tick(gamestate)`: Logs Yantra client methods and gamestate every 100 game ticks.

## Configuration

The `config.js` file contains numerous configuration settings that affect the game's initial state and behavior. This file is heavily utilized in the `space-melee` mode to demonstrate the various configuration properties that the Yantra Server and AYYO Client recognize.

## Bootstrapping

The `boot.js` file is responsible for setting up the Yantra client, registering event listeners, and connecting to the Yantra server. The `go` function within `boot.js` is the entry point which initializes the world and sets
