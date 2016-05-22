import {inject, injectable} from 'inversify';

@injectable()
export class StateManager implements IStateManager {

  private _types : any;
  private _eventBus : IEventBus;
  private _logger : ILogger;

  constructor(
        @inject('IEventBus') eventBus: IEventBus,
        @inject('ILogger') logger: ILogger) {
    this._types = {};
    this._eventBus = eventBus;
    this._logger = logger;
  }

  /**
   * Add
   * @param {string} typeId - unique id for type
   * @param {StateProvider} provider - provide state information for this type
   */
  addType(typeId: string, provider: IStateProvider) : void {
    this._types[typeId] = provider;
    this._logger.debug('Defined state type: '+typeId);
  }

  getType(typeId: string) : IStateProvider {
    return this._types[typeId];
  }

  getTypes() : Dict<IStateProvider> {
    return this._types;
  }

  setCurrent(typeId: string, state: string) : any {
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
  }

  emitState(typeId: string, state: any) : void {
    this._eventBus.emit('state', typeId, state);
  }

  getCurrent(typeId: string) : any {
    return this.getType(typeId).getCurrent();
  }

  getAvailable(typeId: string) : any {
    return this.getType(typeId).getAvailable();
  }

}
