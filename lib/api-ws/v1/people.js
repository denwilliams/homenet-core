var Q = require('q');

module.exports = exports = function(broadcast, services) {
  var presence = services.presence;

  presence.on('presence', function(data) {
    // ignore non-people
    if (data.category !== 'person') { return; }

    broadcast('presenceChanged', data);
  });

  var getPeople = function() {
    return presence.getAll()
      .filter(function(item) {
        return item.category === 'person';
      })
      .map(function(item) {
        return {
          id: item.id,
          name: item.name || item.id,
          present: item.isPresent,
          disabled: item.disabled
        };
      });
  };

  return {
    getAll: function() {
      return Q.when(getPeople());
    },
    getById: function(id) {
      var filtered = getPeople()
        .filter(function(person) {
          return person.id === id;
        });

      if (filtered.length === 0) {
        return null;
      }

      return Q.when(filtered[0]);
    }
  };
};
