import { injectable, inject } from 'inversify';

import { Person } from './models/person';
const ROOT_PRESNCE = 'person.any';
const PRESENCE_CATEGORY = 'person';
const PRESENCE_PREFIX = PRESENCE_CATEGORY + '.';
const AVAILABLE_COMMANDS = {
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
};

@injectable()
export class PersonManager implements Homenet.IPersonManager {

  private _presence : Homenet.IPresenceManager;
  private _switches : Homenet.ISwitchManager;
  private _commands : Homenet.ICommandManager;
  private _logger : Homenet.ILogger;
  private _people : Homenet.Dict<Person>;

  constructor(
        @inject('IConfig') config: Homenet.IConfig,
        @inject('IPresenceManager') presence: Homenet.IPresenceManager,
        @inject('ISwitchManager') switches: Homenet.ISwitchManager,
        @inject('ICommandManager') commands: Homenet.ICommandManager,
        @inject('ILogger') logger: Homenet.ILogger) {
    this._presence = presence;
    this._switches = switches;
    this._commands = commands;
    this._logger = logger;
    var people = this._people = {};

    var rootPresence = presence.add(ROOT_PRESNCE, {category:'person', name:'Anyone'});

    this._load(config);
  }

  private _load(config: Homenet.IConfig) : void {
    const people = config.people;
    if (!people) return;

    people.forEach((person: Homenet.IPersonConfig) => {
      this.add(person.id, person.name, -1);
    });
  }

  add(id: string, name: string, timeout: number): Homenet.IPerson {
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

  onAddPerson(person: Person): void {
    this._switches.addInstance(person.switchId, person);
    this._commands.addInstance(person.commandId, person, AVAILABLE_COMMANDS);
  }

  get(id): Person {
    return this._people[id] || null;
  }
}
