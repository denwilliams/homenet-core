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
  const api = kernel.get<Homenet.IApi>('IWebApi');
  const lights = kernel.get<Homenet.ILightsManager>('ILightsManager');
  lights.addSettableType('test', lightFactory);
  const sensors = kernel.get<Homenet.ISensorManager>('ISensorManager');
  sensors.addType('test', sensorFactory);
  sensors.addType('test-value', sensorFactory);
  sensors.addType('test-trigger', sensorFactory);
  const instanceLoader = kernel.get<Homenet.IInstanceLoader>('IInstanceLoader');
  t.context.app = api.app;
  t.context.lights = lights;
  instanceLoader.loadInstances(config);
});

test('GET /switches returns an array of available switches', async (t) => {
  // ARRANGE
  const app: express.Router = t.context.app;
  const request = supertest(app);

  // ACT
  const result: any = await request.get('/v1/switches').expect(200);

  // ASSERT
  t.true(Array.isArray(result.body));
  t.is(result.body.length, 3);
  t.is(result.body[0].id, 'light.one');
  t.is(result.body[0].value, 'unknown');
});

test('GET /switches/:id returns a single switch', async (t) => {
  // ARRANGE
  const app: express.Router = t.context.app;
  const request = supertest(app);

  // ACT
  const result: any = await request.get('/v1/switches/light.one').expect(200);

  // ASSERT
  t.is(result.body.id, 'light.one');
  t.is(result.body.value, 'unknown');
});

test('PUT /switches/:id sets a single switch', async (t) => {
  // ARRANGE
  const app: express.Router = t.context.app;
  const request = supertest(app);
  const lights: Homenet.ILightsManager = t.context.lights;
  const light1 = lights.getInstance('one');
  if (!light1) throw Error('light1 not found');

  // ACT
  const result: any = await request.put('/v1/switches/light.one')
    .send({ value: 'on' })
    .expect(200);

  // ASSERT
  t.is(light1.get(), 'on');
});
