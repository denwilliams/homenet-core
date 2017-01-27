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

test('/instances returns an array of instances', async (t) => {
  // ARRANGE
  const app: express.Router = t.context.app;
  const request = supertest(app);

  // ACT
  const result: any = await request.get('/v1/instances');

  // ASSERT
  t.is(result.body.length, 7);
  t.is(result.body[0].class, 'light');
  t.is(result.body[0].id, 'one');
  t.is(result.body[0].zone, 'simple');
});
