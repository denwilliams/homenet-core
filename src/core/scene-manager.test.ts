import { createKernel } from '../inversify.testkernel';
import test from 'ava';

test.beforeEach(t => {
  const kernel = createKernel();
  t.context.kernel = kernel;
  t.context.sceneManager = kernel.get('ISceneManager');
});

test('#current returns current scene', t => {
  // ARRANGE
  const SCENE_NAME ='jalsjdlkasj';
  const sceneManager: Homenet.ISceneManager = t.context.sceneManager;
  sceneManager.set(SCENE_NAME);

  // ACT
  const scene: Homenet.IScene = sceneManager.current;

  // ASSERT
  t.truthy(scene);
  t.is(scene.id, SCENE_NAME);
});

test('should have initial scene default', t => {
  // technically this logic comes from another module

  // ARRANGE
  const sceneManager: Homenet.ISceneManager = t.context.sceneManager;

  // ACT
  const scene: Homenet.IScene = sceneManager.current;

  // ASSERT
  t.truthy(scene);
  t.is(scene.id, 'default');
  t.is(scene.name, 'default');
});

test('should store set scene in persistence', t => {
  // ARRANGE
  const SCENE_NAME ='khasdf';
  const sceneManager: Homenet.ISceneManager = t.context.sceneManager;
  const persistence: Homenet.IPersistence = t.context.kernel.get('IPersistence');

  // ACT
  sceneManager.set(SCENE_NAME);

  // ASSERT
  const promise: any = persistence.get('scene')
  .then(s => {
    t.is(s, SCENE_NAME);
  });
  return promise;
});


test('fires "changed" event after scene changed', t => {
  // ARRANGE
  t.plan(1);
  const SCENE_NAME ='ajfasoijas';
  const sceneManager: Homenet.ISceneManager = t.context.sceneManager;
  sceneManager.onChanged(assertSceneChanged)

  // ACT
  sceneManager.set(SCENE_NAME);

  // ASSERT
  function assertSceneChanged(scene) {
    t.is(scene, SCENE_NAME);
  }
});
