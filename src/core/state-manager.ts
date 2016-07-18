/// <reference path="../interfaces.d.ts"/>
import { inject, injectable } from 'inversify';
// import {Homenet} from '../interfaces.d.ts';

@injectable()
export class StateManager implements Homenet.IStateManager {

  private _types : any;
  private _eventBus : Homenet.IEventBus;
  private _logger : Homenet.ILogger;

  constructor(
        @inject('IEventBus') eventBus: Homenet.IEventBus,
        @inject('ILogger') logger: Homenet.ILogger) {
    this._types = {};
    this._eventBus = eventBus;
    this._logger = logger;
  }

  /**
   * Add
   * @param {string} typeId - unique id for type
   * @param {StateProvider} provider - provide state information for this type
   */
  addType(typeId: string, provider: Homenet.IStateProvider) : void {
    this._types[typeId] = provider;
    this._logger.debug('Defined state type: '+typeId);
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
      this._logger.info('Setting ' + typeId + ' state to ' + state);
      var type = this.getType(typeId);
      if (!type.setCurrent) {
        this._logger.warn('Could not set state for type ' + typeId + ' - no setCurrent method defined');
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
    this._eventBus.emit('state.' + typeId, 'changed', state);
  }

  getCurrent(typeId: string) : Promise<string> {
    return this.getType(typeId).getCurrent();
  }

  getAvailable(typeId: string) : string[] {
    return this.getType(typeId).getAvailable();
  }
}
