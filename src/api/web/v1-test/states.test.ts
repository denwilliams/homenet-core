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
  instanceLoader.loadInstances(config);
  t.context.app = api.app;
  t.context.kernel = kernel;
});

test('GET /states returns an array of objects with id and state', async (t) => {
  // ARRANGE
  const app: express.Router = t.context.app;
  const request: supertest.SuperTest = supertest(app);

  // ACT
  const result: any = await request.get('/v1/states').expect(200);

  // ASSERT
  t.true(Array.isArray(result.body));
  t.is(result.body.length, 2);
  t.is(result.body[0].id, 'sunlight');
  t.is(result.body[0].state, 'light');
});

test('GET /states/:type returns the state of a single type', async (t) => {
  // ARRANGE
  const app: express.Router = t.context.app;
  const request: supertest.SuperTest = supertest(app);

  // ACT
  const result: any = await request.get('/v1/states/sunlight').expect(200);

  // ASSERT
  t.is(result.body.id, 'sunlight');
  t.is(result.body.state, 'light');
});

test('PUT /states/:type sets the state', async (t) => {
  // ARRANGE
  const app: express.Router = t.context.app;
  const request: supertest.SuperTest = supertest(app);
  const scenes: Homenet.ISceneManager = t.context.kernel.get('ISceneManager');

  // ACT
  const result: any = await request.put('/v1/states/scene')
    .send({ state: 'tested' })
    .expect(200);

  // ASSERT
  t.is(scenes.current.id, 'tested');
});
