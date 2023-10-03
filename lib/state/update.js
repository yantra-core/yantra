let update = function update (bodyId, state) {

  if (!this.connected) {
    console.log('not connected to world, cannot setVelocity');
    return;
  }
  let json = {};
  let _state = state;
  _state.id = bodyId;
  _state.type = 'BODY';

  json.state = [_state];
  let msg = { event: 'creator_json', ayyoKey: '1234', json: json, ctime: new Date().getTime() };
  this.sendJSON(msg);
  return;
}

export default update;