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
    svc.all.push({id: person.id, name:person.name, presence:'unknown'});
  });


  var app = express();
  app.use(bodyParser.json());

  app.use('/:who/:what', function(req, res) {

    var who = req.params.who;
    var what = req.params.what;
    var present;

    var p = presence.get('person:'+who);
    if (!p) {
      return res.status(500).send('Cannot find person: '+who);
    }

    if (what === 'present' || what === 'away') {
      
      present = what;

    } else if (what === 'geohopper') {

      var gevent = req.body.event;

      switch (gevent) {
      case 'LocationEnter':
        present = 'present';
        break;
      case 'LocationExit':
        present = 'away';
        break;
      default:
        p.toggle();
        res.send('toggled');
        return;
      }

      present = req.body.event === 'LocationEnter' ? 'present' : 'away';
      logger.debug('Geohopper: ' + who + ' - ' + req.body.event);

    } else {

      res.status(500).send('error');
      return;

    }

    var method = (present === 'present') ? 'set' : 'clear';
    p[method]();
    res.send(who + ' is ' + present);
    logger.info('Person: ' + who + ' - ' + present);

  });

  svc.app = app;
  return svc;
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;