var fs = require('fs');
var path = require('path');

module.exports = exports = function(services) {
  var config = services.config;
  //var modules = readModules(config.pluginsPath, config.pluginsPathDepth);
  return modules;
};

function readModules(modulePath, depth) {
  var modules = [];
  var items = fs.readdirSync(modulePath);

  items.forEach(function(item) {

    var submodulePath = path.join(modulePath, item);
    var stats = fs.statSync(submodulePath);

    if (depth > 0 && stats.isDirectory()) {

      modules = modules.concat(readModules(submodulePath, depth-1));
    
    } else if (item === 'index.js') {

      var module = require(submodulePath);
      if (module.$name) {
        modules.push(module);
      }

    }

  });

  return modules;
}


exports.$implements = 'nodeRedUserModules';
exports.$inject = ['config'];
