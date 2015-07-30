var express = require('express');

function factory(services) {

  return createApi(services.people);

  function createApi(people) {

    var app = express();

    app.get('/', function (req, res) {
      res.send(people.all);
    });

    app.get('/me', function (req, res) {
      res.send(people.all);
    });

    app.get('/:id', function (req, res) {
      var id = req.params.id;
      res.send(getPerson(id));
    });

    app.patch('/:id', function (req, res) {
      var id = req.params.id;
      var presence = req.body.presence;
      var person = getPerson(id);
      //var value = (state === 'locked');
      //lock.set(value);
      res.send(getPerson(id));
    });

    return app;


    function getPerson(id) {
    	var filtered = people.all.filter(function(p) {
    		return p.id === id;
    	});
    	return filtered.length === 0 ? null : filtered[0];
    }
  }
}

module.exports = exports = factory;
