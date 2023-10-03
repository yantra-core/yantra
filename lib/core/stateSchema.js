import avro from 'avsc';

/**
 * Custom logical type used to encode native Date objects as longs.
 *
 * It also supports reading dates serialized as strings (by creating an
 * appropriate resolver).
 *
 */
class DateType extends avro.types.LogicalType {
  _fromValue(val) {
    return new Date(val);
  }
  _toValue(date) {
    return date instanceof Date ? +date : undefined;
  }
  _resolve(type) {
    if (avro.Type.isType(type, 'long', 'string', 'logical:timestamp-millis')) {
      return this._fromValue;
    }
  }
}

const stateSchema = avro.Type.forSchema({
  type: 'record',
  name: 'State',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'destroy', type: ["null", "boolean"], default: null },
    { name: 'emitCollisionEvents', type: ["null", "boolean"], default: null },
    { name: 'nickname', type: ["null", "string"], default: null },
    { name: "fillColor", type: ["null", "int"], default: null },
    {
      name: 'type',
      type: {
        type: 'enum',
        name: 'ThingType',
        symbols: ['PLAYER', 'BULLET', 'MINE', 'ETHER', 'PLANET', 'PIXEL', 'WALL', 'STARPORT', 'HEXAPOD', 'HIVE', 'TURRET', 'QUEEN', 'ELEMENT', 'MISSILE', 'BOMB', 'DEFLECTOR', 'LASER', 'KEY', 'DOOR', 'TILE', 'PLATFORM', 'BODY', 'TEXT', 'EVENT_EXPLODE', 'EVENT_TELEPORT_OUT', 'EVENT_TELEPORT_IN', 'EVENT_PAINT', 'EVENT_KILL', 'EVENT_MESSAGE', 'EVENT_COLLISION', 'UNKNOWN'],
        default: 'UNKNOWN'
      }
    },
    { name: 'owner', type: ["null", "string"], default: null },
    { name: 'texture', type: ["null", "string"], default: null },
    { name: 'text', type: ["null", "string"], default: null },
    { name: 'target', type: ["null", "string"], default: null },
    { name: 'x', type: ["null", "int"], default: null },
    { name: 'y', type: ["null", "int"], default: null },
    { name: 'width', type: ["null", "int"], default: null },
    { name: 'height', type: ["null", "int"], default: null },
    { name: 'radius', type: ["null", "int"], default: null },
    { name: 'rotation', type: ["null", "int"], default: null },
    { name: 'velocityX', type: ["null", "int"], default: null },
    { name: 'velocityY', type: ["null", "int"], default: null },
    { name: 'mass', type: ["null", "int"], default: null },
    { name: 'score', type: ["null", "int"], default: null },
    { name: 'kills', type: ["null", "int"], default: null },
    { name: 'deaths', type: ["null", "int"], default: null },
    { name: 'health', type: ["null", "int"], default: null },
    { name: 'energy', type: ["null", "int"], default: null },
    { name: 'duration', type: ["null", "int"], default: null },
    { name: 'faction', type: ["null", "string"], default: null },
    { name: 'brain', type: ["null", "boolean"], default: null },
    { name: 'maxHealth', type: ["null", "int"], default: null },
    { name: 'maxEnergy', type: ["null", "int"], default: null },
    { name: 'damage', type: ["null", "int"], default: null },
    { name: 'healthRegenRate', type: ["null", "int"], default: null },
    { name: 'energyRegenRate', type: ["null", "int"], default: null },
    { name: 'thrust', type: ["null", "int"], default: null },
    { name: 'rotationSpeed', type: ["null", "int"], default: null },
    { name: 'kind', type: ["null", "string"], default: null },
    {
      name: 'modifiers', type: ["null", {
        type: 'array', items:
        {
          type: 'record', fields: [
            { name: 'id', type: 'string' }, // nanoid
            { name: 'ctime', type: 'long' }, // creation time
            { name: 'ran', type: 'int' }, // how long modifier has been running
            { name: 'name', type: 'string' }, // name of modifier, i.e "Speed Boost" or "Damage Boost"
            { name: 'duration', type: 'int' } // duration in ms, removed when duration expires, -1 for permanent
          ]
        }
      }
      ],
      default: null
    }
  ]
});

const stateArraySchema = avro.Type.forSchema({
  type: 'array',
  name: 'PlayerState',
  items: stateSchema
});

export default stateArraySchema;