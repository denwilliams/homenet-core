var IMPLEMENTS = 'authorization';
var INJECT = ['logger'];

var Q = require('q');

function factory(services) {

  return {
    authorize: function(token) {
      return Q.when(token === 'abcd123');
    }
  };

}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;