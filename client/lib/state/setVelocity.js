let setVelocity = async function setVelocity (bodyId, force) {
  if (!this.connected) {
    console.log('not connected to world, cannot setVelocity');
    return;
  }
  let json = {};

  let state = {
    id: bodyId,
    type: 'BODY',
    velocity: force
  };

  if (typeof bodyId === 'string') {
    // state already constructed with default BODY type
  } else {
    state.id = bodyId.id;
    state.type = bodyId.type;
  }

  json.state = [state];
  let msg = { event: 'creator_json', ayyoKey: '1234', json: json, ctime: new Date().getTime() };
  this.sendJSON(msg);
  return;
}

export default setVelocity;