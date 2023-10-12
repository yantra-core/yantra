let set = function set (updates) {
  if (!this.connected) {
    console.log('not connected to world, cannot create');
    return;
  }
  let json = {};
  json.config = updates;
  let msg = { event: 'set_config', ayyoKey: '1234', json: json, ctime: new Date().getTime() };
  this.sendJSON(msg);
}

export default set;