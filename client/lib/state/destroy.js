let destroy = function destroy (state) {
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

  json.state.forEach(function (state) {
    state.destroy = true;
  });

  let msg = { event: 'creator_json', ayyoKey: '1234', json: json, ctime: new Date().getTime() };
  this.sendJSON(msg);
}

export default destroy;