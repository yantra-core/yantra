function bindInspectorKeys (self) {

  self.screen.key(['escape', 'q', 'C-c'], (ch, key) => {
    return process.exit(0);
  });

  self.screen.key(['left', 'right'], (ch, key) => {
    const focusedColumnIndex = [self.column1, self.column2, self.column3].findIndex(column => column === self.screen.focused);
    const nextFocusedColumnIndex = key.name === 'right'
      ? (focusedColumnIndex + 1) % 3
      : (focusedColumnIndex + 2) % 3;

    const nextFocusedColumn = [self.column1, self.column2, self.column3][nextFocusedColumnIndex];
    nextFocusedColumn.focus();
  });

}

export default bindInspectorKeys;