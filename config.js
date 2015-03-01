module.exports = exports = function(config) {
  return function factory() {
    return config;
  };
};