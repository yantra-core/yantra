# Yantra Example World
<img src="https://yantra.gg/img/yantra-logo-med.png"/>
https://yantra.gg

This repository contains an example implementation showcasing a simple world setup using the Yantra serverless physics platform. The example is structured to run within the Yantra environment, demonstrating the initialization of a world and handling game ticks.

## Getting Started

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Run the example using `npm start`.

You may also run `yantra init` to create a new world using this project as the base scaffold.

## File Structure

- `config.js`: Contains configuration settings for the world.
- `boot.js`: Sets up the Yantra client, registers event listeners, and connects to the Yantra server.
- `world.js`: Contains the main world logic, handles initialization, and game tick updates.

## World Logic

The world logic is contained within the `world.js` file which exports a `world` object with the following structure:

- `init(Y)`: Initializes the world, creates a box entity.
- `tick(gamestate)`: Logs Yantra client methods and gamestate every 100 game ticks.

## Bootstrapping

The `boot.js` file is responsible for setting up the Yantra client, registering event listeners, and connecting to the Yantra server. The `go` function within `boot.js` is the entry point which initializes the world and sets up the event handler for game state updates.

## Configuration

You can update world configurations by modifying the `config.js` file as needed.
