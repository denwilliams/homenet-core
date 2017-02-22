import { GraphQLScalarType } from 'graphql';

const BASIC_RESULT = { success: true };

const Primitive = new GraphQLScalarType({
  name: 'Primitive',
  description: 'A Primitive can be either a string, number, or boolean',
  serialize(value) {
    if (value === null || value === undefined) return null;
    if (typeof value === 'object') throw new Error('Expected primitive');
    return value;
  },
  parseValue(value) {
    if (value === null || value === undefined) return null;
    if (typeof value === 'object') throw new Error('Expected primitive');
    return value;
  },
  parseLiteral(ast) {
    switch (ast.kind) {
      case 'BooleanValue':
      case 'StringValue':
      case 'IntValue':
      case 'FloatValue':
        return ast.value;
      default:
        return undefined;
    }
  }
});

const Query = {
  zones(_, args, { zones }) {
    return zones.getAll();
  },
  state(_, { type }, ctx) {
    const states: Homenet.IStateManager = ctx.states;
    return states.getType(type);
  }
};

const Mutation = {
  runCommand(_, { id, command, jsonArgs }, ctx) {
    const commands: Homenet.ICommandManager = ctx.commands;
    let args = jsonArgs ? JSON.parse(jsonArgs) : null;
    if (jsonArgs && !Array.isArray(jsonArgs)) jsonArgs = [jsonArgs];
    return Promise.resolve(commands.run(id, command, jsonArgs))
    .then(() => BASIC_RESULT);
  },
  setSwitch(_, { id, value }, ctx) {
    const switches: Homenet.ISwitchManager = ctx.switches;
    return Promise.resolve(switches.set(id, value))
    .then(() => BASIC_RESULT);
  },
  setState(_, { type, state }, ctx) {
    const states: Homenet.IStateManager = ctx.states;
    return states.setCurrent(type, state)
    .then(() => BASIC_RESULT)
  }
};

const State = {
  current(obj: Homenet.IStateProvider, args) {
    return obj.getCurrent();
  },
  available(obj: Homenet.IStateProvider, args) {
    return obj.getAvailable();
  }
};

const Zone = {
  lights(zone, args, { classesManager }) {
    return classesManager.getInstancesDetails()
    .filter(i => i.class === 'light' && i.zone === zone.id);
  },
  locks(zone, args, { classesManager }) {
    return classesManager.getInstancesDetails()
    .filter(i => i.class === 'lock' && i.zone === zone.id);
  },
  sensors(zone, args, { classesManager }) {
    return classesManager.getInstancesDetails()
    .filter(i => i.class === 'sensor' && i.zone === zone.id);
  }
};

function instance(classId: string) {
  return {
    switch(light, args, ctx) {
      const switches: Homenet.ISwitchManager = ctx.switches;
      return switches.getInstance(classId + '.' + light.id);
    },
    commands(light, args, ctx) {
      const commands: Homenet.ICommandManager = ctx.commands;
      return commands.getInstance(classId + '.' + light.id);
    },
    values(sensor, args, ctx) {
      const values: Homenet.IValuesManager = ctx.values;
      return values.getInstance(classId + '.' + sensor.id);
    }
  };
}

const Switch = {
  value(sw: Homenet.ISwitch) {
    return sw.get();
  }
};

const Values = {
  items(values: Homenet.IValueStore) {
    const itemsMap = values.getAll();
    const items = [];
    for (const key in itemsMap) {
      const val = itemsMap[key];
      items.push({
        key,
        value: val,
        svalue: typeof val === 'string' ? val : null,
        ivalue: typeof val === 'number' && Number.isInteger(val) ? val : null,
        fvalue: typeof val === 'number' && !Number.isInteger(val) ? val : null,
        bvalue: typeof val === 'boolean' ? val : null,
      });
    }
    return items;
  }
};

const Commands = {
  available(cmd) {
    const meta = cmd.commandMeta;
    return (meta && Object.keys(meta) || [])
    .map(key => ({
      command: key,
      title: meta[key].title,
      comment: meta[key].comment
    }));
  }
};

export const root = {
  Query: Query,
  Mutation: Mutation,
  State: State,
  Zone: Zone,
  Light: instance('light'),
  Lock: instance('lock'),
  Sensor: instance('sensor'),
  Commands: Commands,
  Switch: Switch,
  Values: Values,
  Primitive: Primitive
};
