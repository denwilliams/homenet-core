var ioc = require('async-ioc');
var Q = require('q');
var fs = require('fs');
var path = require('path');

exports.start = function(config) {

  return Q.try(function() {
    var configSvc = require('./config')(config);

    var plugins = readPlugins(config.pluginsPath, config.pluginsPathDepth);
    var nodesContainer = require('./nodes');

    var deps = [];
    
    var container = ioc.createContainer()
      // .debug(true)
      .register('config', configSvc)
      .register('nodes', nodesContainer)
      .registerAll(__dirname + '/lib');

    console.log('Plugins: ' + plugins.length);

    plugins.forEach(function(plugin) {
      plugin.nodes.forEach(function(componentPath) {
        nodesContainer.nodes.push(componentPath);
      });
      container.register(plugin.$name, plugin, plugin.$require);
      deps.push(plugin.$name);
    });

    console.log(deps);
    // deps.push('lights');
    deps.push('appStart');

    container.register('moduleStart', function(services) {
      // services.lights.hue.setLights('main', 4, 'bright')
      //   .then(function() {
      //     console.log('set!');
      //   })
      //   .fail(function(err) {
      //     console.error(err.message);
      //   });
    }, deps);

    return container.start('moduleStart');
  });

};

function readPlugins(pluginPath, depth) {
  console.log('Loading plugins from: ' + pluginPath + ' - ' + depth);
  var plugins = [];
  var items = fs.readdirSync(pluginPath);

  items.forEach(function(item) {
    
    var subpluginPath = path.join(pluginPath, item);
    var stats = fs.statSync(subpluginPath);

    if (depth > 0 && stats.isDirectory()) {
      plugins = plugins.concat(readPlugins(subpluginPath, depth-1));
    } else if (item === 'index.js') {
      console.log('Found plugin: ' + pluginPath);
      var plugin = require(subpluginPath);
      if (plugin.$name) {
        console.log('It\'s a real plugin!');
        plugin.nodes = readNodes( path.join(pluginPath, 'nodes') );
        plugins.push(plugin);
      }
    }

  });

  return plugins;
}

function readNodes(nodesPath) {
  console.log(nodesPath);

  if (!fs.existsSync(nodesPath)) {
    return [];
  }

  var nodes = [];
  var items = fs.readdirSync(nodesPath);

  items.forEach(function(item) {
    var parts = item.split('.');
    var ext = parts[parts.length - 1];

    if (ext !== 'js') return;

    console.log(nodesPath, item);
    var componentPath = path.join( nodesPath, item );
    nodes.push(componentPath);
  });

  return nodes;
}
