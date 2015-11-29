exports.load = function() {
  function Light() {
  }

  Light.prototype.emitOnSet = true;

  return Light;
};
