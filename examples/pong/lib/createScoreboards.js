
function createScoreboards(Y) {
  // Create a scoreboard for blue and red teams ( styling is handled by the client )
  Y.create({
    id: 'scoreboard-blue',
    type: 'TEXT',
    // kind: 'scoreboard',
    text: '0',
    nickname: '0',
    x: -1000,
    y: 0
  });
  Y.create({
    id: 'scoreboard-red',
    type: 'TEXT',
    // kind: 'scoreboard',
    text: '0',
    nickname: '0',
    x: 1000,
    y: 0
  });
};

export default createScoreboards;
