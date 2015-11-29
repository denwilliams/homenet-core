var IMPLEMENTS = 'entertainment';
var INJECT = ['config'];

function factory(services) {

  var volumeTypes = {};
  var mediaTypes = {};
  var selectorTypes = {};

  var volumeControls = {};
  var media = {};
  var inputSelectors = {};

  var conf = services.config.entertainment;

  return {
    addVolumeControlType: addVolumeControlType,
    addInputSelectorType: addInputSelectorType,
    addMediaType: addMediaType,
    setVolume: setVolume,
    adjustVolume: adjustVolume,
    selectInput: selectInput,
    playMedia: playMedia,
    controlMedia: controlMedia
  };

  function init() {
    conf.devices.forEach(function(dev) {
      dev.classes.forEach(function(c) {

      });
      volumeControls[dev.id] = {
        set: setVolume()
      };
    });
  }

  function addVolumeControlType(id, type) {
    volumeTypes[id] = type;
  }

  function addMediaType(id, type) {
    mediaTypes[id] = type;
  }

  function addInputSelectorType(id, media) {
    inputSelectors[id] = media;
  }

  function addVolumeControl(id, control) {
    volumeControls[id] = control;
  }

  function addMedia(id, media) {
    media[id] = media;
  }

  function addInputSelector(id, media) {
    inputSelectors[id] = media;
  }

  /**
   * Adjusts the volume by the percentage amount
   */
  function adjustVolume(id, amount) {
    // body...
  }

  function setVolume(id, volume) {
    volumeControls[id].setVolume(volume);
  }

  function selectInput() {
    // body...
  }

  function playMedia() {
    // body...
  }

  function controlMedia() {
    // body...
  }

  // function getZone(id) {
  //   var zone = zones[id];
  //   if (!zone) {
  //     zone = {};
  //     zones[id] = zone;
  //   }
  //   return zone;
  // }
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;