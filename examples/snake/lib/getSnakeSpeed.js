function getSnakeSpeed(score) {
  const BASE_SPEED = 3.3;
  const INCREMENT = 0.333; // or whatever value you deem reasonable
  return BASE_SPEED + (score * INCREMENT);
}

export default getSnakeSpeed;