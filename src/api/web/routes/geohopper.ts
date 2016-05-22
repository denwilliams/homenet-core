import WebApiDependencies = require('../dependencies');

import * as express from 'express';
import _ = require('lodash');

export function createRouter(services: Homenet.Api.IWebDependencies) : express.Router {

  const presence: IPresenceManager = services.presence;
  const config: IConfig = services.config;
  const logger: ILogger = services.logger;

  const app = express();
  let peopleWithTokens = {};

  config.instances.filter(personWithTokenFilter).forEach(person => {
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
        msg = 'Setting person present: '+personId;
        p.set();
        break;
      case 'LocationExit':
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
}

function personWithTokenFilter(item: {class: string, options:any}) {
  return item.class === 'person' && item.options && item.options.token;
}
