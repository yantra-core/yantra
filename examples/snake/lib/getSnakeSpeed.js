function getSnakeSpeed(score) {
  const BASE_SPEED = 3.3;
  const INCREMENT = 0.333; 
  const MAX_SPEED = 10;
  return Math.min(BASE_SPEED + (score * INCREMENT), MAX_SPEED);
}


export default getSnakeSpeed;