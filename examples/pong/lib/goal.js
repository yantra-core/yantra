import pong from '../pong.js';


function goal(Y) {

  let scores = pong.scores;
  let scoringTeam = pong.scoringTeam;
  let scoringGoal = pong.scoringGoal;  
  let scoringBall = pong.scoringBall;

  scores[scoringTeam]++;           // Increase the score for the team that scored the goal

  Y.set({                       // When a goal is scored, broadcast a message to all connected players
    type: 'EVENT_MESSAGE',         // `EVENT_MESSAGE` is a special type for broadcasting transient messages
    text: `Goooooooooooaaal!`,
    x: 0,
    y: 0,
    height: 100,                   // TODO: remove height and width from EVENT_MESSAGE API, have sane defaults
    width: 100
  });

  let highScore = 4; // first to 4 wins
  // The round reset when the score is high enough
  if (scores.blue >= highScore || scores.red >= highScore) {
    let winner = scores.blue > scores.red ? 'Blue' : 'Red';
    Y.set({                     // Broadcast a message Game Over message to all connected players
      type: 'EVENT_MESSAGE',
      text: `${winner} wins! Game Over.`,
      x: 0,
      y: 0,
      height: 100, // TODO: remove these from EVENT_MESSAGE API, have sane defaults
      width: 100
    });

    // Reset the scores
    scores.blue = 0;
    scores.red = 0;
  }

  // update the scoreboard texts
  Y.set({
    id: 'scoreboard-blue',
    type: 'TEXT',
    text: scores.blue.toString() // remove the toString()
  });
  Y.set({
    id: 'scoreboard-red',
    type: 'TEXT',
    text: scores.red.toString()
  });

  // update the wall colors to indicate a goal has been scored
  Y.set({
    id: scoringGoal.id,
    type: 'BODY',
    fillColor: 0x00ff00
  });

  let fillColor = 0x0000ff;

  if (scoringGoal.id === 'wall-right') {
    fillColor = 0xff0000;
  }
  if (scoringGoal.id === 'wall-left') {
    fillColor = 0x0000ff;
  }
  // change the goal colors back to normal after 2 seconds
  Y.set({
    id: scoringGoal.id,
    type: 'BODY',
    fillColor: fillColor, // TODO: scoringGoal.fillColor ( should propigate? )
    // TODO: make delay in gameticks, not milliseconds
    delay: 2000 // delay is optional, delays the state change by the specified number of milliseconds
  });


  // after a goal is scored, reset the ball position by pushing a new state to res.state
  // the `velocity` property will set an absolute velocity
  // to apply a relative force use the `force` property instead
  Y.set({
    id: scoringBall.id,
    type: scoringBall.type,
    x: 0,       // reset the X position to center
    y: 0,       // reset the Y position to center
    velocity: {         // set an initial velocity
      x: 2.4,             // resets the X velocity to 0
      y: 2.4             // resets the Y velocity to 0
    }
  });

};

export default goal;