let clearAll = function create (Y) {
  if (!this.connected) {
    console.log('not connected to world, cannot create');
    return;
  }
  let json = {};
  json.state = [{
    type: 'EVENT_MESSAGE',
    kind: 'clearAll'
  }];
  console.log('sending clear message', json)
  let msg = { event: 'creator_json', ayyoKey: '1234', json: json, ctime: new Date().getTime() };
  Y.sendJSON(msg);
}

export default clearAll;