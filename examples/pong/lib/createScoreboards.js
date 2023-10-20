function createScoreboards(Y) {

  let height = Y.worldConfig.room.height;
  let width = Y.worldConfig.room.width;

  // Create a scoreboard for blue and red teams ( styling is handled by the client )
  Y.create({
    id: 'scoreboard-blue',
    type: 'TEXT',
    // kind: 'scoreboard',
    text: '0',
    nickname: '0',
    x: -width / 2 + 100,
    y: 0 - 200 // height of text
  });
  Y.create({
    id: 'scoreboard-red',
    type: 'TEXT',
    // kind: 'scoreboard',
    text: '0',
    nickname: '0',
    x: width / 2 - 300,
    y: 0 - 200 // height of text
  });
};

export default createScoreboards;