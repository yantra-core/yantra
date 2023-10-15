

let columnHeight = '63%';
let columnTop = '8%';

import createListColumn from "./createListColumn.js";
import createBoxColumn from "./createBoxColumn.js";


let createColumns = function createColumns(self) {
  self.column1 = createListColumn(0, '33%');
  self.column2 = createListColumn('33%', '34%');
  self.column3 = createBoxColumn('67%', '33%');

  self.column1.on('focus', () => {
    self.column1.style.border.fg = 'yellow';  // Choose a high-visibility color
    self.screen.render();
  });

  self.column1.on('blur', () => {
    self.column1.style.border.fg = 'green';  // Revert to the original color
    self.screen.render();
  });

  self.column2.on('focus', () => {
    self.column2.style.border.fg = 'yellow';  // Choose a high-visibility color
    self.screen.render();
  });

  self.column2.on('blur', () => {
    self.column2.style.border.fg = 'green';  // Revert to the original color
    self.screen.render();
  });


  self.column3.on('focus', () => {
    self.column3.style.border.fg = 'yellow';  // Choose a high-visibility color
    self.screen.render();
  });

  self.column3.on('blur', () => {
    self.column3.style.border.fg = 'green';  // Revert to the original color
    self.screen.render();
  });

  self.screen.append(self.column1);
  self.screen.append(self.column2);
  self.screen.append(self.column3);

};

export default createColumns;