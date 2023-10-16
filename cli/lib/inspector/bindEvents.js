function bindInspectorEvents (self) {

  self.column1.on('keypress', (ch, key) => {
    try {
      if (key.name === 'up' || key.name === 'down') {
        const index = self.column1.selected;
        // Set the items for column2 based on the selected item in column1
        self.column2.setItems(self.formattedData.entities[self.formattedData.collections[index]]);
        
        // Optionally, focus on column2
        // self.column2.focus();
      }
    } catch (err) {
      console.log(err);
    }
  });

  self.column2.on('select', (item, index) => {
    try {
      const selectedEntity = self.formattedData.entities[self.formattedData.collections[self.column1.selected]][index];
      const properties = self.formattedData.properties[selectedEntity];
      let propertiesText = '';
      for (let prop in properties) {
        propertiesText += `${prop}: ${properties[prop]}\n`;
      }
      self.column3.setContent(propertiesText);
    } catch (err) {
      console.log(err);
    }
  });

};

export default bindInspectorEvents;