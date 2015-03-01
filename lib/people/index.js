var IMPLEMENTS = 'people';
var INJECT = ['logger', 'presence', 'config'];

function factory(services) {
  var people = services.config.people;
  var presence = services.presence;
  var logger = services.logger.getLogger('people');

  var svc = {all:[]};

  presence.add('person:any', {category:'person', name:'Anyone'});

  people.forEach(function(person) {
    presence.add('person:'+person.id, {category:'person', name:person.name, timeout:person.timeout, parent:'person:any'});
    svc.all.push({id: person.id});
  });
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;