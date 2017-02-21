import { createKernel } from '../../../inversify.testkernel';
import test from 'ava';
import * as express from 'express';
import * as supertest from 'supertest-as-promised';
import * as sinon from 'sinon';
import { config } from './fixtures/api-test-config';
import { factory as lightFactory } from './fixtures/lights';
import { factory as sensorFactory } from './fixtures/sensors';

test.beforeEach(t => {
  const kernel = createKernel();
  kernel.unbind('IConfig');
  kernel.bind<Homenet.IConfig>('IConfig').toConstantValue(config);
  const api = kernel.get<Homenet.IApi>('IWebApi');
  const lights = kernel.get<Homenet.ILightsManager>('ILightsManager');
  const sensors = kernel.get<Homenet.ISensorManager>('ISensorManager');
  lights.addSettableType('test', lightFactory);
  sensors.addType('test', sensorFactory);
  sensors.addType('test-value', sensorFactory);
  sensors.addType('test-trigger', sensorFactory);
  // const plugins = kernel.get<Homenet.IPlugins>('IPlugins');
  // plugins.loadAll();
  const instanceLoader = kernel.get<Homenet.IInstanceLoader>('IInstanceLoader');
  instanceLoader.loadInstances(config);
  t.context.app = api.app;
  t.context.lights = lights;
});

test('GET /commands returns an array of objects with id and commands', async (t) => {
  // ARRANGE
  const app: express.Router = t.context.app;
  const request = supertest(app);

  // ACT
  const result: any = await request.get('/v1/commands').expect(200);

  // ASSERT
  t.true(Array.isArray(result.body));
  t.is(result.body.length, 3);
  t.is(result.body[0].id, 'light.one');
  t.truthy(result.body[0].commands);
  t.truthy(result.body[0].commands.turnOn);
  t.truthy(result.body[0].commands.turnOff);
});

test('GET /commands/:id returns a single item with commands', async (t) => {
  // ARRANGE
  const app: express.Router = t.context.app;
  const request = supertest(app);

  // ACT
  const result: any = await request.get('/v1/commands/light.one').expect(200);

  // ASSERT
  t.is(result.body.id, 'light.one');
  t.truthy(result.body.commands);
  t.truthy(result.body.commands.turnOn);
  t.truthy(result.body.commands.turnOff);
});

test('GET /commands/:id/:cmd returns a command metadata', async (t) => {
  // ARRANGE
  const app: express.Router = t.context.app;
  const request = supertest(app);

  // ACT
  const result: any = await request.get('/v1/commands/light.one/turnOn').expect(200);

  // ASSERT
  t.is(result.body.title, 'Turn On');
});

test('GET /commands/:id/:cmd returns a command metadata', async (t) => {
  // ARRANGE
  const app: express.Router = t.context.app;
  const request = supertest(app);

  // ACT
  const result: any = await request.get('/v1/commands/light.one/turnOn').expect(200);

  // ASSERT
  t.is(result.body.title, 'Turn On');
});

test('POST /commands/:id/:cmd executes a command', async (t) => {
  // ARRANGE
  const app: express.Router = t.context.app;
  const request = supertest(app);
  const lights: Homenet.ILightsManager = t.context.lights;
  const light1 = lights.getInstance('one');

  // ACT
  const result: any = await request.post('/v1/commands/light.one/turnOn').expect(200);

  // ASSERT
  t.is(light1.get(), 'on');
});

test('POST /commands/:id/:cmd returns a command response', async (t) => {
  // ARRANGE
  const app: express.Router = t.context.app;
  const request = supertest(app);
  const lights: Homenet.ILightsManager = t.context.lights;
  const light1 = lights.getInstance('one');
  sinon.stub(light1, 'set').returns({test: 'RESULT'});

  // ACT
  const result: any = await request.post('/v1/commands/light.one/turnOn').expect(200);

  // ASSERT
  t.deepEqual(result.body, {test: 'RESULT'})
});

test('POST /commands/:id/:cmd returns a command response after promise resolve', async (t) => {
  // ARRANGE
  const app: express.Router = t.context.app;
  const request = supertest(app);
  const lights: Homenet.ILightsManager = t.context.lights;
  const light1 = lights.getInstance('one');
  sinon.stub(light1, 'set').returns(Promise.resolve({test: 'RESULT'}));

  // ACT
  const result: any = await request.post('/v1/commands/light.one/turnOn').expect(200);

  // ASSERT
  t.deepEqual(result.body, { test: 'RESULT' })
});