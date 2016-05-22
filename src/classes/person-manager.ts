import { injectable, inject } from 'inversify';

var Person = require('./person');
var ROOT_PRESNCE = 'person.any';
var PRESENCE_CATEGORY = 'person';
var PRESENCE_PREFIX = PRESENCE_CATEGORY + '.';

@injectable()
class PersonManager {

  private _presence : IPresenceManager;
  private _switches : ISwitchManager;
  private _commands : ICommandManager;
  private _logger : ILogger;
  private _people : Dict<any>;

  constructor(
        @inject('IPresenceManager') presence: IPresenceManager,
        @inject('ISwitchManager') switches: ISwitchManager,
        @inject('ICommandManager') commands: ICommandManager,
        @inject('ILogger') logger: ILogger) {
    this._presence = presence;
    this._switches = switches;
    this._commands = commands;
    this._logger = logger;
    var people = this._people = {};

    switches.addType('person', function(opts) {
      return people[opts.id];
    });
    commands.addType('person', function(opts) {
      var person = people[opts.id];
      return {
        bump: function() {
          person.bump();
        },
        present: function() {
          person.set(true);
        },
        away: function() {
          person.set(false);
        }
      };
    }, {
      'bump': {
        "title": "Bump Presence",
        "comment": ""
      },
      'present': {
        "title": "Make Present",
        "comment": ""
      },
      'away': {
        "title": "Make Away",
        "comment": ""
      }
    });

    var rootPresence = presence.add(ROOT_PRESNCE, {category:'person', name:'Anyone'});
  }

  add(id, name, timeout) {
    var presence = this._presence;
    var opts = {
      category: PRESENCE_CATEGORY,
      name: name,
      timeout: timeout,
      parent: ROOT_PRESNCE
    };
    var personPresence = presence.add(PRESENCE_PREFIX+id, opts);
    var person = this._people[id] = new Person(id, name, personPresence);
    this.onAddPerson(person);
    return person;
  }

  onAddPerson(person) {
    this._switches.addInstance('person', person.id, {id: person.id});
    this._commands.addInstance('person', person.id, {id: person.id});
  }

  get(id) {
    return this._people[id];
  }

}

export = PersonManager;
