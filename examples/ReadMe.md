# Yantra Examples Repository
<img src="https://yantra.gg/img/yantra-logo-med.png"/>
https://yantra.gg

This repository serves as a collection of example implementations showcasing the capabilities of the Yantra serverless physics platform. Each example is structured to run within the Yantra environment, demonstrating various aspects of game development including game state management, collisions, player interactions, and configuration settings, among others.

## Table of Contents

- [Getting Started](#getting-started)
- [Examples Overview](#examples-overview)
- [API Basics](#api-basics)
- [AYYO: Yantra Game Client](#ayyo-yantra-game-client)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

1. Clone this repository to your local machine.
2. Navigate to the desired example directory.
3. Install the necessary dependencies using `npm install`.
4. Run the example using `npm start`.
5. Alternatively, you can install any of the example worlds directly using the command `yantra clone worldname` where `worldname` is the name of the example world you wish to clone (e.g., `yantra clone pong`).

## Examples Overview

The examples cover a range of game genres and mechanics. While the specific examples may evolve over time, as of now, the repository includes the following worlds:

- `pong`: Classic Pong game.
- `platformer`: Basic platformer setup.
- `space-melee`: Space melee game with extensive configuration settings.
- `world`: Simple world setup demonstrating initialization and game tick updates.
- `snake`: Classic snake game.

Each example contains a `boot.js`, `world.js`, and `config.js` file at a minimum, along with other necessary files for running the example. The `ReadMe.md` file within each example directory provides more detailed information on the implementation and how to run the example.

## API Basics

The `0_API_Basics` directory provides scripts demonstrating basic API interactions with the Yantra platform, such as creating bodies, detecting collisions, applying forces, mutating gamestate, viewing player positions, and creating a world.

## AYYO: Yantra Game Client

[AYYO](https://ayyo.gg) is the default game client provided by Yantra. Yantra focuses on serverless physics and backend development, necessitating a client interface for interaction. AYYO serves this purpose as a standardized client for games deployed on Yantra.

### Choose your Client

When developers deploy their games to Yantra, they have two client-side options:

1. Write and implement their own custom game client.
2. Use the provided AYYO client.

### AYYO as a General-Purpose Yantra Client

AYYO is designed to be a general-purpose client and functions as Yantra's most substantial client implementation, showcasing the platform's features and scalability. Developers opting for AYYO can streamline their development, utilizing a pre-built client fully integrated with Yantra's backend.

### Start with AYYO

We recommend starting your Yantra development using the AYYO client. AYYO is a great client for retro-style browser games! Once you have gotten a better handle on the Yantra API and deployment lifecycle, you can decide if writing a custom game client is right for you.

## Contributing

We welcome contributions to this examples repository. Whether you are a seasoned game developer or just getting started, your experiences and insights can benefit others in the community. Feel free to submit issues, enhancements, or new example implementations!

## License

AGPL