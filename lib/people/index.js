var IMPLEMENTS = 'people';
var INJECT = ['logger', 'presence', 'config'];

var express = require('express');
var bodyParser = require('body-parser');

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


  var app = express();
  app.use(bodyParser.json());

  app.use('/:who/:what', function(req, res) {

    var who = req.params.who;
    var what = req.params.what;
    var method, present;

    if (what === 'present' || what === 'away') {
      
      present = what;
      method = (present === 'present') ? 'set' : 'clear';

    } else if (what === 'geohopper') {

      present = req.body.event === 'LocationEnter' ? 'present' : 'away';
      method = (present === 'present') ? 'set' : 'clear';
      logger.debug('Geohopper: ' + who + ' - ' + req.body.event);

    } else {

      res.status(500).send('error');
      return;

    }

    presence['person:'+who][method]();
    res.send(who + ' is ' + present);
    logger.info('Person: ' + who + ' - ' + present);

  });

  return {
    app: app
  };

}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;