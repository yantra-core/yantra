import config from './config.js';
import movement from "./lib/movement.js";
import goal from "./lib/goal.js";
import createBall from "./lib/createBall.js";
import createScoreboards from "./lib/createScoreboards.js";
import createWalls from "./lib/createWalls.js";
import fs from 'fs';


// the goal of the game is to get the ball to hit the goal
const pong = {};
pong.config = config;

// keep track of the score for each team
pong.scores = {
  blue: 0,
  red: 0
};

// Keeps track each tick if a goal has been scored
let goalScored = false;

// Keeps track of the ball that scored the goal
let scoringBall = null;

// Keeps track of the team that scored the goal
let scoringTeam = null;

// Keeps track of which goal ( wall ) was scored on
let scoringGoal = null;

let assignedTeam = 'blue';

// The init() function is called once when the game is created
pong.init = async function pongInit(Y) {

  Y.config({
    "player": {
      "width": 40,
      "height": 480,
      "texture": "pixel"
    },
  });

  createBall(Y);
  createScoreboards(Y);
  createWalls(Y);

  Y.on('PLAYER_JOINED', function playerJoined (player) {
    // When the player joins, assign them a team and color
    let fillColor = 0xff0000;
    if (assignedTeam === 'blue') {
      fillColor = 0x0000ff;
      assignedTeam = 'red';
    } else {
      assignedTeam = 'blue';
    }
    // Update the player's fillColor by setting a new state object
    Y.set({
      id: player.id,
      type: 'PLAYER',
      fillColor: fillColor
    });
  });

}

// The collision() function is called each time a collision occurs
// You must set `emitCollisionEvents: true` on the state object to enable collision events
pong.collision = function (collision) {
  // TODO: move collision logic here
};

//
// The tick() function is called each game tick
// This is the main game loop, where you can send new response state based on request state
pong.tick = function (gamestate) {

  // console.log('running pong.tick', gamestate);
  let Y = this;
  // reset goal tracking each tick
  //pong.state.goalScored = false; //etc 
  // this.goalScored = false; 
  goalScored = false;
  scoringBall = null;
  scoringTeam = null;
  scoringGoal = null;
  //console.log('gamestate', gamestate.state.length)
  //
  // `req.state` contains incoming authorative game state as an array of state objects
  // We can mutate server state by sending state via `res.send()`
  //
  gamestate.state.forEach(function (state) { // for each existing state in the req
    //   console.log(state)

    // Instead we just check if the player has been assigned a fillColor ( rename to color )
    if (state.type === 'PLAYER') {

      // If the Player is pressing an input control ( keyboard, gamepad, mouse, etc )
      if (state.controls && Object.keys(state.controls).length > 0) {
        // moves the player based on req controls
        Y.set(movement(state));
        //        ^^^ movement() creates a new state object representing the player's movement
        // Y.set() will send the new state to yantra server, which applies the mutation server-side
      }
    }
    // A collision has occurred, check to see if it was the ball hitting the goal
    // TODO: move these to separate file / collider check?
    if (state.type === 'EVENT_COLLISION') {
      let bodyA = state.states[0];
      let bodyB = state.states[1];
      // if the ball collides with the left or right wall, increase the score
      if (
        (bodyA.type === 'BODY' && bodyA.kind === 'ball') &&
        (bodyB.id === 'wall-left' || bodyB.id === 'wall-right')) {
        // a goal has been scored
        goalScored = true;
        // track the ball that scored the goal
        pong.scoringBall = bodyA;
        pong.scoringGoal = bodyB;

        // track which team scored the goal ( owner of the wall that was hit )
        if (bodyB.owner === 'blue') {
          pong.scoringTeam = 'red';
        } else{
          pong.scoringTeam = 'blue';
        }
        console.log('goal scored', pong.scoringTeam);

      } else {
        if (
          (bodyA.type === 'BODY' && bodyA.kind === 'ball')) {
          // take the current velocity of bodyA and invert it
          let invertedVelocity = {
            x: bodyB.velocityX * 1.2,
            y: bodyB.velocityY * 1.2
          }

          if (bodyB.velocityX === 0 && bodyB.velocityY === 0) {
            invertedVelocity = {
              x: bodyA.velocityX,
              y: bodyA.velocityY * -1.2
            }
          }
          // console.log('current V', bodyA.velocity)
          // apply a force to the ball when it collides with a player
          //console.log('Y.setVelocity', bodyA.id, invertedVelocity)
          Y.setVelocity(bodyA.id, invertedVelocity);
        }
      }
    }
  });

  if (goalScored) { // if a goal was scored this game tick
    goal(Y);
  }

}

export default pong;
// ping