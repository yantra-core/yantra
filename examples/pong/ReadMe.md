# Pong - Yantra Example World
<img src="https://yantra.gg/img/yantra-logo-med.png"/>
https://yantra.gg


This repository contains an example implementation of a classic Pong game using the Yantra serverless physics platform. The game is structured to run within the Yantra environment and showcases how to manage game state, player interactions, and collision detection in a serverless physics world.

## Getting Started

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Run the game using `npm start`.

If you have installed the [Yantra CLI](https://github.com/yantra-core/sdk/tree/master/cli) you can instead run `yantra clone pong` to clone the game into the current working directory.

## File Structure

- `config.js`: Contains configuration settings for the game.
- `boot.js`: Sets up the Yantra client, registers event listeners, and connects to the Yantra server.
- `pong.js`: Contains the main game logic, handles initialization, collisions, and game state updates.
- `package.json`: Defines the project dependencies and scripts.
- `lib/`: Contains utility libraries for creating game entities and handling game logic.
  - `movement.js`: Handles player movement.
  - `goal.js`: Handles goal scoring logic.
  - `createBall.js`: Utility for creating the game ball entity.
  - `createScoreboards.js`: Utility for creating scoreboard entities.
  - `createWalls.js`: Utility for creating wall entities.

## Game Logic

The game logic is contained within the `pong.js` file which exports a `pong` object with the following structure:

- `init(Y)`: Initializes the game world, creates the ball, scoreboards, and walls, and sets up the player join event listener.
- `collision(event)`: Handles collision events, checks for goals, and applies forces to the ball when colliding with players.
- `tick(gamestate)`: The main game loop which processes player inputs and updates game state.

## Game State

The game state is managed using a `pong` object which keeps track of the scores, whether a goal has been scored, and which team scored the goal.

## Event Handling

- `PLAYER_JOINED`: Assigns players to teams and updates player colors.
- Collision Events: Checks for goals and applies forces to the ball upon collisions.

## Configuration

You can update game configurations such as player dimensions and textures by modifying the `Y.config({})` call within the `init` function.

## Bootstrapping

The `boot.js` file is responsible for setting up the Yantra client, registering event listeners, and connecting to the Yantra server. The `go` function within `boot.js` is the entry point which initializes the game world and sets up the event handlers for game state updates and collision events.