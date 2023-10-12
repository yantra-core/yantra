let set = function set (state) {
  if (!this.connected) {
    console.log('not connected to world, cannot create');
    return;
  }
  let json = {};

  if (Array.isArray(state)) {
    json.state = state;
  } else {
    json.state = [state];
  }

  let msg = { event: 'creator_json', ayyoKey: '1234', json: json, ctime: new Date().getTime() };
  this.sendJSON(msg);
}

export default set;