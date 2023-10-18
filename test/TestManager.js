/*
  Simple TestManager class that allows you to queue up tests to run at a specific tick.
*/

class TestManager {
  constructor(Y) {
    this.tests = []; // List of { tick: number, testFn: function }
    this.currentTick = 0;

    Y.on('gamestate', (snapshot) => this._processTick(snapshot));
  }

  queueTest(tick, testFn) {
    this.tests.push({ tick, testFn });
    this.tests.sort((a, b) => a.tick - b.tick);
  }

  _processTick(snapshot) {
    this.currentTick++;

    while (this.tests.length && this.tests[0].tick === this.currentTick) {
      let { testFn } = this.tests.shift();
      testFn(snapshot);
    }
  }
}

export default TestManager;