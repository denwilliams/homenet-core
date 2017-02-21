/// <reference path="../interfaces.d.ts"/>
import { inject, injectable } from 'inversify';
// import {Homenet} from '../interfaces.d.ts';

@injectable()
export class StateManager implements Homenet.IStateManager {
  private _types : any;

  constructor(
        @inject('IEventBus') private eventBus: Homenet.IEventBus,
        @inject('ILogger') private logger: Homenet.ILogger) {
    this._types = {};
  }

  /**
   * Add
   * @param {string} typeId - unique id for type
   * @param {StateProvider} provider - provide state information for this type
   */
  addType(typeId: string, provider: Homenet.IStateProvider) : void {
    this._types[typeId] = provider;
    this.logger.debug('Defined state type: '+typeId);
  }

  getType(typeId: string) : Homenet.IStateProvider {
    return this._types[typeId];
  }

  getTypes() : Homenet.Dict<Homenet.IStateProvider> {
    return this._types;
  }

  setCurrent(typeId: string, state: string) : Promise<string> {
    return Promise.resolve()
    .then(() => {
      this.logger.info('Setting ' + typeId + ' state to ' + state);
      var type = this.getType(typeId);
      if (!type.setCurrent) {
        this.logger.warn('Could not set state for type ' + typeId + ' - no setCurrent method defined');
        return;
      }
      var result = type.setCurrent(state);
      if (type.emitOnSet) {
        this.emitState(typeId, state);
      }
      return result;
    });
  }

  emitState(typeId: string, state: string) : void {
    this.eventBus.emit('state.' + typeId, 'changed', state);
  }

  getCurrent(typeId: string) : Promise<string> {
    return this.getType(typeId).getCurrent();
  }

  getAvailable(typeId: string) : string[] {
    return this.getType(typeId).getAvailable();
  }
}
