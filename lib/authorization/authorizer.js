var Q = require('q');

/**
 * @class Authorizer
 */
function Authorizer(config) {

  var tokens = {};

  if (config.people) {
    config.people.forEach(function(person) {
      if (person.token) {
        tokens[person.token] = person.id;
      }
    });
  }

  return {
    /**
     * @method Authorizer#authorize
     * @param  {string} token
     * @return {Promise<string>}
     */
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

module.exports = exports = Authorizer;