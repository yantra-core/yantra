function onServerMessage (self, data) {
  self.formattedData = self.formatGameState(data);  // Store the formatted data
  self.column1.setItems(self.formattedData.collections);

  if (
    self.column1.selected !== undefined &&
    self.column2.selected !== undefined &&
    self.formattedData.collections[self.column1.selected] &&
    self.formattedData.entities[self.formattedData.collections[self.column1.selected]]
  ) {
    const selectedEntity = self.formattedData.entities[self.formattedData.collections[self.column1.selected]][self.column2.selected];
    const properties = self.formattedData.properties[selectedEntity];
    let propertiesText = '';
    for (let prop in properties) {
      propertiesText += `${prop}: ${properties[prop]}\n`;
    }
    self.column3.setContent(propertiesText);
  }
  
  self.screen.render();  // Render every 33 game ticks

};

export default onServerMessage;