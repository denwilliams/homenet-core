var IMPLEMENTS = 'authorization';
var INJECT = ['logger', 'config'];

var Q = require('q');

function factory(services) {

  var config = services.config;
  var tokens = {};

  config.people.forEach(function(person) {
    if (person.token) {
      tokens[person.token] = person.id;
    }
  });


  return {
    authorize: function(token) {

      console.log(token, tokens);
      var id = tokens[token];
      console.log(id);
      if (id) {
        return Q.resolve(id);
      } else {
        return Q.reject(new Error('Not authorized'));
      }
    }
  };

}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;