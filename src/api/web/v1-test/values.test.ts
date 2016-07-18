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
  t.context.sensors = sensors;
  t.context.values = kernel.get<Homenet.IValuesManager>('IValuesManager');
  instanceLoader.loadInstances(config);
});

test('GET /values returns an array of available values', async (t) => {
  // ARRANGE
  const app: express.Router = t.context.app;
  const request: supertest.SuperTest = supertest(app);
  const sensors: Homenet.ISensorManager = t.context.sensors;
  const sensor = sensors.getInstance('temperature');
  const sensorValue: Homenet.IValueStore = t.context.values.getInstance('sensor', 'temperature');
  await sensorValue.waitReady();
  (<any> sensor).set('temperature', '20C');

  // ACT
  const result: any = await request.get('/v1/values').expect(200);

  // ASSERT
  t.true(Array.isArray(result.body));
  t.is(result.body.length, 3);
  t.is(result.body[0].id, 'sensor.generic');
  t.is(result.body[1].id, 'sensor.temperature');
  t.is(result.body[2].id, 'sensor.humidity');
  t.deepEqual(result.body[0].values, {});
  t.deepEqual(result.body[1].values, { temperature: '20C' });
});

test('GET /values/:id returns a single value source', async (t) => {
  // ARRANGE
  const app: express.Router = t.context.app;
  const request: supertest.SuperTest = supertest(app);
  const sensor = t.context.sensors.getInstance('temperature');
  const sensorValue: Homenet.IValueStore = t.context.values.getInstance('sensor', 'temperature');
  await sensorValue.waitReady();
  sensor.set('temperature', '30C');

  // ACT
  const result: any = await request.get('/v1/values/sensor.temperature').expect(200);

  // ASSERT
  t.is(result.body.id, 'sensor.temperature');
  t.deepEqual(result.body.values, { temperature: '30C' });
});
