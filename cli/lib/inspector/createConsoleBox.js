import blessed from 'blessed';

let createConsoleBox = function createConsoleBox() {
  return blessed.box({
    top: '69%',  // Position the box at the bottom 20% of the screen
    left: 0,
    width: '100%',
    height: '33%',
    border: { type: 'line' },
    scrollable: true,
    keys: true,
    mouse: true,
  });
};

export default createConsoleBox;