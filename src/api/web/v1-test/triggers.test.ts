import { createKernel } from '../../../inversify.testkernel';
import test from 'ava';
import * as express from 'express';
import * as supertest from 'supertest-as-promised';
import { config } from './fixtures/api-test-config';
import { factory as lightFactory } from './fixtures/lights';
import { factory as sensorFactory } from './fixtures/sensors';

test.beforeEach(t => {
  const kernel = createKernel();
  kernel.unbind('IConfig');
  kernel.bind<Homenet.IConfig>('IConfig').toConstantValue(config);
  const api = kernel.get<Homenet.IWebApi>('IWebApi');
  const lights = kernel.get<Homenet.ILightsManager>('ILightsManager');
  lights.addType('test', lightFactory);
  const sensors = kernel.get<Homenet.ISensorManager>('ISensorManager');
  sensors.addType('test', sensorFactory);
  sensors.addType('test-value', sensorFactory);
  sensors.addType('test-trigger', sensorFactory);
  const instanceLoader = kernel.get<Homenet.IInstanceLoader>('IInstanceLoader');
  t.context.app = api.app;
  t.context.triggers = kernel.get<Homenet.ITriggerManager>('ITriggerManager');
  instanceLoader.loadInstances(config);
});

test('GET /triggers returns an array of object with ID and lastTriggered', async (t) => {
  // ARRANGE
  const app: express.Router = t.context.app;
  const request = supertest(app);

  // ACT
  const result: any = await request.get('/v1/triggers').expect(200);

  // ASSERT
  t.true(Array.isArray(result.body));
  t.is(result.body.length, 1);
  t.is(result.body[0].id, 'sensor.motion');
  t.is(result.body[0].lastTriggered, null);
});

test('GET /triggers/:id returns a single item', async (t) => {
  // ARRANGE
  const app: express.Router = t.context.app;
  const request = supertest(app);

  // ACT
  const result: any = await request.get('/v1/triggers/sensor.motion').expect(200);

  // ASSERT
  t.is(result.body.id, 'sensor.motion');
  t.is(result.body.lastTriggered, null);
});

test('POST /triggers/:id triggers an item', async (t) => {
  // ARRANGE
  const app: express.Router = t.context.app;
  const request = supertest(app);
  const triggers: Homenet.ITriggerManager = t.context.triggers;
  const trigger = triggers.get('sensor', 'motion');

  // ACT
  const result: any = await request.post('/v1/triggers/sensor.motion').expect(200);

  // ASSERT
  t.is(result.body.id, 'sensor.motion');
  t.not(result.body.lastTriggered, null);
  t.not(trigger.lastTriggered, result.body.lastTriggered);
});
