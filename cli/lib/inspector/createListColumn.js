
import blessed from 'blessed';

let columnHeight = '63%';
let columnTop = '8%';


let createListColumn = function createListColumn(left, width) {
  return blessed.list({
    top: columnTop,
    left: left,
    width: width,
    height: columnHeight,
    border: { type: 'line' },
    style: {
      selected: { bg: 'green', fg: 'black' },  // Style for the selected row
      item: { bg: 'black', fg: 'white' },  // Style for other rows
      cursor: { bg: 'blue', fg: 'white' }  // Style for the cursor
    },
    keys: true,
    mouse: true,
  });
};

export default createListColumn;