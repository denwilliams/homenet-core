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
  instanceLoader.loadInstances(config);
});

test('GET /presence returns an array of objects with id and present', async (t) => {
  // ARRANGE
  const app: express.Router = t.context.app;
  const request: supertest.SuperTest = supertest(app);

  // ACT
  const result: any = await request.get('/v1/presence').expect(200);

  // ASSERT
  t.true(Array.isArray(result.body));
  t.is(result.body.length, 8); // zones + sensors
  t.is(result.body[0].id, 'zone.simple');
  t.is(result.body[0].present, false);
});

test('GET /presence/:id returns an object with id and present', async (t) => {
  // ARRANGE
  const app: express.Router = t.context.app;
  const request: supertest.SuperTest = supertest(app);

  // ACT
  const result: any = await request.get('/v1/presence/zone.simple').expect(200);

  // ASSERT
  t.is(result.body.id, 'zone.simple');
  t.is(result.body.present, false);
});
