import formatGamestateCache from "./formatGamestateCache.js";

function onServerMessage(self, snapshot) {

  let data = self.client.cache;
  self.formattedData = formatGamestateCache(data);
  
  // Set items for column1
  self.column1.setItems(self.formattedData.collections);

  if (typeof self.column1.selected === 'undefined') {
    self.column1.select(0);  // Select the first item in column1
  }

  const index = self.column1.selected;
  // Set the items for column2 based on the selected item in column1
  self.column2.setItems(self.formattedData.entities[self.formattedData.collections[index]]);

  // Update the content of column3 based on the selected items in column1 and column2
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
  
  self.screen.render();
};


export default onServerMessage;