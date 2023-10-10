import snake from '../snake.js';
import playerDied from './playerDied.js';

function playerTailCollision(state) {
  let bodyA = state.states[0];
  let bodyB = state.states[1];

  if (
    (bodyA.type === 'PLAYER') &&
    (bodyB.type === 'TILE' && bodyB.kind === 'tail')
     ) {
    // players can collide with their own tail, but only if it's not the most recent tail
    if (bodyA.id === bodyB.owner) {
      let now = new Date().getTime();
      let diff = now - bodyB.utime;
      if (diff < 3000) {
        return;
      }
      // console.log('going to collide with own tail');
    }
    // console.log('player gonna deied')
    return playerDied(bodyA);
  }

}

export default playerTailCollision;