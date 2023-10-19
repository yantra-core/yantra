let MELEE_FFA = {
  id: 'MELEE_FFA',
  mode: 'MELEE_FFA',
  movement: 'default',
  width: 5000,
  height: 5000,
  maxPlayers: 111,
  startingPlanet: 'Earth',

  client: {
    batteryBars: true,
    copilotDashboard: true,
    chatWindow: true,
    shipStats: true,
    spaceBackground: false,
    scoreOdometer: true,
    shipTrails: true,
    itemBar: true,
    miniMap: true,
    autoZoom: true,
    uiAchievements: true,
    zoomToPlayer: true,
    applyStats: true,
    camera: {
      mode: 'follow'
    },
  },

  worldWrap: true,
  border: 'dode',
  zoneCount: 1,
  etherCount: 66,
  elementCount: 444,
  maxBots: 33,
  botsEnabled: true,
  keyCount: 3,
  doorCount: 2,
  hexapodCount: 33,
  botHealthRegenRate: 0.1,
  botHealth: 55.55,
  turretsActive: true,
  exitWallsEnabled: true,
  
  allianceChecks: false,
  friendlyFire: true,
  planetContactDamage: true,
  planetGravity: false,
  powerUpsEnabled: true,
  scoreIncreasesStats: true,

  ship: {
    engine: {
      THRUST_FORCE: 10.0077 * 0.1888,
      ROTATION_SPEED: 0.066,
      TURN_RATE: 200,
      MAX_SPEED: 4.2222,
      HEALTH_REGEN_RATE: 0
    },
    fusionGun: {
      BULLET_RATE: 300,
      BULLET_ENERGY: 2,
      BULLET_LIFESPAN: 999,
      MASS: 1,
      DAMAGE: 10
    }
  },

  zetaQuadrant: {
    id: 'zetaQuadrant',
    x: -88888,
    y: -88888,
    width: 1200,
    height: 1200
  }
};

MELEE_FFA.player = {
  width: 32,
  height: 32,
  texture: 'triangle'
};

export default MELEE_FFA;