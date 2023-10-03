let create = async function create (state) {
  if (!this.connected) {
    console.log('not connected to world, cannot create');
    return;
  }
  let json = {};
  json.state = [state];
  let msg = { event: 'creator_json', ayyoKey: '1234', json: json, ctime: new Date().getTime() };
  this.sendJSON(msg);
}

export default create;