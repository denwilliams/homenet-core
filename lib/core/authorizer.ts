import Q = require('q');

/**
 * @class Authorizer
 */
class Authorizer implements IAuthorizer {

  private _tokens : Dict<string>;

  constructor(config: IConfig) {
    let tokens = this._tokens = {};

    if (config.people) {
      config.people.forEach((person) => {
        if (person.token) {
          tokens[person.token] = person.id;
        }
      });
    }
  }

  /**
   * @method Authorizer#authorize
   * @param  {string} token
   * @return {Promise<string>}
   */
  authorize(token: string) : Q.Promise<string> {
    console.log(token, this._tokens);

    var id = this._tokens[token];
    console.log(id);
    if (id) {
      return Q.resolve<string>(id);
    } else {
      return Q.reject<string>(new Error('Not authorized'));
    }
  }

}

export = Authorizer;
