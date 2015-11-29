var express = require('express');
var _ = require('lodash');

module.exports = exports = function(services) {
  var app = express();
  var presence = services.presence;
  var config = services.config;
  var logger = services.logger.getLogger('geohopper');

  var peopleWithTokens = {};
  config.instances.filter(personWithTokenFilter).forEach(function(person) {
    peopleWithTokens[person.options.token] = person.id;
  });

  app.post('/:token', function(req, res) {
    var token, personId, msg, p;
    
    token = req.params.token;
    if (token) personId = peopleWithTokens[token];
    if (personId) p = presence.get('person.'+personId);

    if (!p) {
      msg = 'Cannot find person: '+token;
      logger.warn(msg);
      return res.status(500).send(msg);
    }

    var gevent = req.body.event;

    switch (gevent) {
      case 'LocationEnter':
        present = 'present';
        msg = 'Setting person present: '+personId;
        p.set();
        break;
      case 'LocationExit':
        present = 'away';
        msg = 'Setting person away: '+personId;
        p.clear();
        break;
      default:
        p.toggle();
        res.send('toggled');
        msg = 'Toggle person presence: '+personId;
        break;
    }
    logger.info(msg);
    res.send(msg);
  });

  return app;
};

function personWithTokenFilter(item) {
  return item.class === 'person' && item.options && item.options.token;
}