const SunCalc = require('suncalc');
import {EventEmitter} from 'events';
import domain = require('domain');
import {injectable, inject} from 'inversify';
// import {Homenet} from '../interfaces.d.ts';

const TEN_MINS = 600000;
const ONE_MIN = 60000;
const TEN_SECS = 10000;
const INTERVAL = ONE_MIN;
const FIRST_INTERVAL = TEN_SECS;
const STATE_TYPE = 'sunlight';

/**
 * Fires sunlight based events provided a latitude and longitude.
 * Returns a {@link module:sunlight.SunlightMonitor} instance.
 * @module sunlight
 * @see module:sunlight.SunlightMonitor
 */
@injectable()
export class Sunlight extends EventEmitter implements Homenet.ISunlight {

  private _logger: Homenet.ILogger;
  private _latitude: number;
  private _longitude: number;
  private _state: boolean;

  constructor(
        @inject('ILogger') logger: Homenet.ILogger,
        @inject('IConfig') config: Homenet.IConfig,
        @inject('IStateManager') states: Homenet.IStateManager) {
    super();

    var location: Homenet.IConfigCoords = config.location || {};

    this._logger = logger;
    this._latitude = location.latitude;
    this._longitude = location.longitude;

    this.init();

    this.on('light', function(lightState) {
      states.emitState(STATE_TYPE, lightState.value);
    });

    this._addStateType(states);
  }

  private _addStateType(states: Homenet.IStateManager) : void {
    const self = this;
    states.addType(STATE_TYPE, {

      getCurrent: function() {
        return self.current;
      },

      setCurrent: function(state:string|any) {
        // ignore
      },

      getAvailable: function() {
        return null; // ignore
      }
    });
  }

  /**
   * @constructs module:sunlight.SunlightMonitor
   * @implements {EventEmitter}
   * @param  {Object} options - monitor options
   * @param {float} options.latitude - latitude of coords to monitor
   * @param {float} options.longitude - longitude of coords to monitor
   * @param {Logger} options.logger - logger instance to use
   */
  init() : void {
    //  var mqtt = options.mqtt;
    const latitude = this._latitude;
    const longitude = this._longitude;

    var state;

    if (!latitude || !longitude) {
      this._logger.warn('Location not provided - sunlight module disabled');
    } else {
      this._logger.info('Sunlight calculations based on ' + latitude + ', ' + longitude);
      this._logger.info('Sunlight is currently: ' + this.currentLight());
    }

    this.start();
  }

  start() : void {
    const self = this;

    // run every ten mins
    var interval = setInterval(function() {
      self.refresh();
    }, INTERVAL);

    // first run in 5 secs
    setTimeout(function() {
      self.refresh();
    }, FIRST_INTERVAL);
  }

  stop() : void {
    // TODO: stop interval
  }

  /**
    * Gets a value indicating the current light state - either "light" or "dark"
    * @member current
    * @memberOf module:sunlight.SunlightMonitor#
    * @readOnly
    */
  get current() : any {
    return { isLight: this.isLight(), primaryState: this.currentLight() };
  }

  refresh() : void {
    var newState = this.isDark();
    if (this._state != newState) {
      this._state = newState;
      var stateName = (this._state ? 'dark' : 'light');
      this.emit('light', {value:stateName});
      //mqtt.publish('environment/light', {value: stateName});
      //mqtt.publishNotification('light',stateName,'yellow');
    }
  }

  /**
   * Returns true if the monitored coordinates are currently light
   * @method isLight
   * @memberOf module:sunlight.SunlightMonitor#
   * @returns {Boolean}
   */
  isLight() : boolean {
    return !this.isDark();
  }

  /**
   * Returns true if the monitored coordinates are currently dark
   * @method isDark
   * @memberOf module:sunlight.SunlightMonitor#
   * @returns {Boolean}
   */
  isDark() : boolean {
    if (!this._latitude || !this._longitude) return false;

    var now = new Date();
    var times = SunCalc.getTimes(now, this._latitude, this._longitude);
    // using goldenhour instead of sunset/sunrise as it starts to get dark then
    var pastSunrise = this._dateDiff(times.goldenHourEnd, now) < 0;
    var pastSunset = this._dateDiff(times.goldenHour, now) < 0;
    return pastSunset || (!pastSunrise);
  }

  currentLight() : string {
    return this.isLight() ? 'light' : 'dark';
  }

  private _dateDiff(d1, d2) : number {
    return d1.getTime() - d2.getTime();
  }

}
