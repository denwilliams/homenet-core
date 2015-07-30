var express = require('express');

function factory (services) {

  return createApi(services.locks);

  function createApi(locks) {

    var app = express();

    app.get('/', function (req, res) {
      res.send(locks.all);
    });

    app.get('/:id', function (req, res) {
      var id = req.params.id;
      res.send(getLock(id));
    });

    app.patch('/:id', function (req, res) {
      var id = req.params.id;
      var state = req.body.state;
      var lock = getLock(id);
      var value = (state === 'locked');
      lock.set(value);
      res.send(getLock(id));
    });

    return app;

    function getLock(id) {
      return locks.get(id);
    }
  }
}

module.exports = exports = factory;
