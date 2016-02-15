/// <reference path="../../interfaces/interfaces.d.ts"/>

var EventEmitter2 = require('eventemitter2').EventEmitter2;
var chalk = require('chalk');

function eventName(source:string, event:string) : string {
  if (!event) return source;
  return source + '.' + event;
}

/**
 * @class SharedEventEmitter
 */
class SharedEventEmitter implements IEventBus {
  private _e : any;
  private _logger : ILogger;

  constructor(logger: ILogger) {
    this._logger = logger;
    this._e = new EventEmitter2({
      wildcard:true,
      maxListeners: 50
    });
  }

  /**
   * @method SharedEventEmitter#emit
   * @param  {string} source [description]
   * @param  {string} event  [description]
   * @param  {Mixed}  data   [description]
   */
  emit(source:string, event:string, data:any) : void {
    var name = eventName(source, event);
    // console.log('Listeners:', name, e.listeners(name));
    var evt = {
      name: name,
      data: data
    };
    this._e.emit(name, evt);
    this._logger.info(chalk.magenta('Event emitted: ') + chalk.cyan(name) + ' -> ' + JSON.stringify(data));
  }

  /**
   * @method SharedEventEmitter#on
   * @param  {string}   source [description]
   * @param  {string}   event  [description]
   * @param  {Function} cb     [description]
   */
  on(source:string, event:string, cb:Function) : void {
    var name = eventName(source, event);
    this._e.on(name, cb);
    // console.log('Listeners:', name, e.listeners(name));
  }

  /**
   * @method onAny
   * @memberOf SharedEventEmitter#
   * @param  {Function} cb - called on any event
   */
  onAny(cb:Function) : void {
    this._e.onAny(cb);
  }

  /**
   * @method SharedEventEmitter#removeListener
   * @param  {string}   source [description]
   * @param  {string}   event  [description]
   * @param  {Function} cb     [description]
   */
  removeListener(source:string, event:string, registeredCb:Function) : void {
    const name = eventName(source, event);
    this._e.removeListener(name, registeredCb);
    // console.log('Listeners:', name, e.listeners(name));
  }
}

export = SharedEventEmitter;
