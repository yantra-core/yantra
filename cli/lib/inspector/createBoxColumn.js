import blessed from 'blessed';

let columnHeight = '63%';
let columnTop = '8%';

let createBoxColumn = function(left, width) {
  return blessed.box({
    top: columnTop,
    left: left,
    width: width,
    height: columnHeight,
    border: { type: 'line' },
    scrollable: true,
    keys: true,
    mouse: true,
  });
};

export default createBoxColumn;