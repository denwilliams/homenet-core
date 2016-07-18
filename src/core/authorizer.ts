import Q = require('q');
import {inject, injectable} from 'inversify';
// import {Homenet} from '../interfaces.d.ts';

/**
 * @class Authorizer
 */
@injectable()
export class Authorizer implements Homenet.IAuthorizer {

  private _tokens : Homenet.Dict<string>;

  constructor(@inject('IConfig') config: Homenet.IConfig) {
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
    var id = this._tokens[token];
    if (id) {
      return Q.resolve<string>(id);
    } else {
      return Q.reject<string>(new Error('Not authorized'));
    }
  }

}
