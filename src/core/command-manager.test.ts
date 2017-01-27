import { createKernel } from '../inversify.testkernel';
import test from 'ava';

const factory: Homenet.ICommanderFactory = () : Homenet.ICommander => {
  const commander: Homenet.ICommander = {
    add(arg1, arg2) { return Promise.resolve(arg1 + arg2); }
  };
  return commander;
};

const meta = {
  add: { title: 'Add', comment: "Adds 2 numbers" }
};

test.beforeEach(t => {
  const kernel = createKernel();
  const commandManager = kernel.get<Homenet.ICommandManager>('ICommandManager');
  t.context.commandManager = commandManager;
});

test('#addInstance adds a new instance', t => {
  // ARRANGE
  const commandManager: Homenet.ICommandManager = t.context.commandManager;

  // ACT
  commandManager.addInstance('test.1', 1, {});

  // ASSERT
  t.is(Object.keys(commandManager.getAll()).length, 1);
});

test('#getInstance returns an added instance', t => {
  // ARRANGE
  const commandManager: Homenet.ICommandManager = t.context.commandManager;
  commandManager.addInstance('test.1', 1, {});

  // ACT
  const commander: Homenet.ICommander = commandManager.getInstance('test.1');

  // ASSERT
  t.truthy(commander);
});

test('#getInstance returns null if no instance', t => {
  // ARRANGE
  const commandManager: Homenet.ICommandManager = t.context.commandManager;

  // ACT
  const commander: Homenet.ICommander = commandManager.getInstance('test.1');

  // ASSERT
  t.is(commander, null);
});

test('#run returns result of command', async (t) => {
  // ARRANGE
  const commandManager: Homenet.ICommandManager = t.context.commandManager;
  const commander = {
    add(a, b) { return a + b; }
  };
  commandManager.addInstance('test.1', commander, {});

  // ACT
  const result = await commandManager.run('test.1', 'add', [2, 3]);

  // ASSERT
  t.is(result, 5);
});

test('#getMeta gets metadata for an instances type', t => {
  // ARRANGE
  const commandManager: Homenet.ICommandManager = t.context.commandManager;
  commandManager.addInstance('test.1', {}, {testmeta: true});

  // ACT
  const meta = commandManager.getMeta('test.1');

  // ASSERT
  t.truthy(meta['testmeta']);
});
