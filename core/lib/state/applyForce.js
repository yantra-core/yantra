let applyForce = async function applyForce (bodyId, force) {

  if (!this.connected) {
    console.log('not connected to world, cannot applyForce');
    return;
  }
  let json = {};
  let state = {
    id: bodyId,
    type: 'BODY',
    force: force
  };
  json.state = [state];
  let msg = { event: 'creator_json', ayyoKey: '1234', json: json, ctime: new Date().getTime() };
  this.sendJSON(msg);
  return;
}

export default applyForce;