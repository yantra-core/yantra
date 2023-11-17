# `@yantra-core/yantra`

`@yantra-core/yantra` is the core SDK for interfacing with the Yantra Serverless Physics.

 With this SDK, you can create, manage, and interact with dynamic physics environments in the cloud. Below is a guide on how to use it.

 `yantra` works in tandem with [mantra](https://github.com/yantra-core/mantra). You can develop your games locally using `mantra` and then run `yantra deploy` in the game's directory to deploy to cloud.

<img src="https://yantra.gg/img/yantra-logo-med.png"/>
Install CLI and run `yantra login` for a free account

## Installation

**Install the SDK CLI (Command Line Tool) with `npm`:**

```bash
npm install -g @yantra-core/cli
```

Now you can run the `yantra` command on your system.

```

  __     __         _                _____ _      _____ 
  \ \   / /        | |              / ____| |    |_   _|
   \ \_/ /_ _ _ __ | |_ _ __ __ _  | |    | |      | |  
    \   / _` | '_ \| __| '__/ _` | | |    | |      | |  
     | | (_| | | | | |_| | | (_| | | |____| |____ _| |_ 
     |_|\__,_|_| |_|\__|_|  \__,_|  \_____|______|_____|
                                                        
 
Usage:  [options] [command]

Yantra Serverless Physics Platform CLI

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  init            Initialize a new world in the current directory
  clone           Clone a world from the Yantra library
  deploy          Deploy your physics world
  list            List your worlds
  info            Checks current directory for a Yantra world and displays information about it
  rm              Remove a world
  whoami          Display the current user
  login           Login to Yantra using OTP or create an account if it does not exist
  logout          Logs CLI client out of Yantra
  recover         Recover your account names by email address
  help [command]  display help for command

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

## Running in Yantra's Environment:

When you upload your code to Yantra, it's executed in our optimized low-latency environment. Here's what you should know:

- **High Performance**: Yantra's backend is fine-tuned to ensure your game logic runs smoothly.
- **Consistent Framerate**: We prioritize a consistent, high framerate, ensuring your gameplay is fluid and responsive.
- **Direct Execution**: Your uploaded code runs directly, 1:1, with no modifications or external dependencies. The performance you see locally will mirror what you get in our cloud environment.


## Support

For issues, bugs, or feedback, please [open an issue on our GitHub repository](https://github.com/yantra-core/yantra) or visit us in our [Discord](https://discord.gg/MWyfw5xVHH)

---
