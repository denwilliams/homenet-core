var Q = require('q');

module.exports = exports = function(broadcast, services) {
  var sceneManager = services.scene;
  var activeScene;

  var scenesDict = sceneManager.scenes;

  var scenes = [];

  for (var id in scenesDict) {
    scenesDict[id].id = id;
    scenes.push(scenesDict[id]);
  }

  sceneManager.onChanged(function(scene) {
    activeScene = scene.id;
    console.log('-------SCENE CHANGED------', scene);
    broadcast('changed', scene);
  });

  activeScene = sceneManager.currentId;

  // var scenes = [
  //   {name:'Sleep', id:'sleep', icon:'fa-moon-o', present:true},
  //   {name:'Normal', id:'normal', icon:'fa-adjust', present:true},
  //   {name:'Away', id:'away', icon:'fa-key', present:false},
  //   {name:'Holiday', id:'holiday', icon:'fa-plane', present:false},
  //   {name:'Movie', id:'movie', icon:'fa-film', present:true},
  // ];

  function getAll() {
    return Q.when(scenes);
  }

  function getById(id) {
    return Q.when(scenesDict[id]);
  }

  function getActive() {
    return getById(activeScene);
  }

  function setActive(sceneId) {
    return getById(sceneId)
      .then(function(scene) {
        sceneManager.set(sceneId);
      });
  }

  function isActive(sceneId) {
    return sceneId === activeScene;
  }

  return {
    getAll: getAll,
    getById: getById,
    getActive: getActive,
    setActive: setActive,
    isActive: isActive,
  };
};
