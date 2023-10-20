let clearAll = function clearAll (Y) {
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
  // user sendState and not sendJSON because we want to clear the states immediately
  // sendJSON will buffer and wait for the next tick
  this.sendState(msg);
}

export default clearAll;