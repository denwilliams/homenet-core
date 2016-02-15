/// <reference path="../typings/q/Q.d.ts" />
/// <reference path="../typings/when/when.d.ts"/>
/// <reference path="../typings/node/node.d.ts"/>

interface IApp {
  start() : void
}

interface IWebApi {
  app: any;
}

interface ILogger {
  info(args : any) : void
  warn(args : any) : void
  error(args : any) : void
  debug(args : any) : void
}

interface ICommon {
  logger: ILogger;
  config: IConfig;
  eventBus: IEventBus;
  notifications: INotificationsManager;
  storage: IStorageManager;
}

interface IAuthorizer {
  authorize(token: string) : Q.Promise<string>;
}

interface ILoggerFactory {
  getLogger(name: string) : ILogger
}

interface ISwitch {
  emitOnSet: boolean
  emitValue(value: boolean|string|number) : void
  get() : any // : Q.Promise<any>
  set(value: any) : void // : Q.Promise<void>
}

interface ICommander {

}

interface ITrigger {
  lastTriggered: Date
  onTrigger(listener: Function) : void
  trigger(data?: any) : void
}

interface ILightsModule {

}

interface IClassesManager {
  addClass<T>(classId: string, classFactory: IClassFactory<T>) : void
}

interface ISwitchManager {
  addType(typeId: string, switchFactory: ISwitchFactory) : void
  addInstance(typeId: string, instanceId: string, opts: any) : void
  getAllInstances() : Dict<ISwitch>
  getInstance(typeId: string, instanceId: string): ISwitch
  set(typeId: string, instanceId: string, value: boolean|string|number) : any
  get(typeId: string, instanceId: string) : boolean|string|number
  emitValue(typeId: string, instanceId: string, value: boolean|string|number) : void
}

interface ICommandManager {
  addType(typeId: string, factory: ICommanderFactory, meta: ICommandTypeMeta) : void
  addInstance(typeId: string, instanceId: string, opts: any) : void
}

interface IStateManager {
  addType(typeId: string, provider: IStateProvider) : void
  getType(typeId: string) : IStateProvider
  getTypes() : Dict<IStateProvider>
  emitState(typeId: string, state: any) : void
  getCurrent(typeId: string) : any;
  setCurrent(typeId: string, state:string|any) : void;
  getAvailable(typeId: string): any;
}

interface IStateProvider {
  emitOnSet?: boolean;
  getCurrent() : any;
  setCurrent(state:string|any) : void;
  getAvailable(): any;
}

interface TypeStateProvider<T> extends IStateProvider {
  getCurrent() : T;
  setCurrent(state:string|T) : void;
}

interface ISceneManager {

  current : IScene;

  set(name: string) : void;
  onChanged(callback : Function) : void;

}

interface ISwitchInstanceProvider {
  () : ISwitch
}

interface ISwitchFactory {
  (opts: any) : ISwitch
}

interface ICommanderFactory {
  (opts: any) : ICommander
}

interface INotificationsManager {
  /**
   * Registers a new notifier type
   * @param  {Notifier} notifier - the notifier to add
   */
  register(notifier: INotifier) : void

  /**
   * Sends a notification
   * @param  {String} severity  - The severity of the message [info|notice|alert|alarm]
   * @param  {String} msgTxt    - The message as text
   * @param  {String} [msgHtml] - The message as html
   */
  send(severity: string, msgTxt: string, msgHtml: [string]) : void
}

interface INotifier {
  notify(severity: string, msgTxt: string, msgHtml: [string]) : void;
}


interface ISensor {
  trigger()
  set(key, value) : void

  // trigger() {
  //   if (!this._trigger) return;
  //   this._trigger.trigger();
  // };

  // on() {
  //   if (!this._presence) return;
  //   this._presence.set();
  // };

  // off() {
  //   if (!this._presence) return;
  //   this._presence.clear();
  // };

  // get(key) {
  //   if (!this._values) return;
  //   return this._values.get(key);
  // };

  // getAll() {
  //   return this._values.getAll();
  // };
}


interface IBaseSensorArgs {

}

interface ISensorEventArgs {
  deviceName: string
}

interface IDeviceEventArgs {
  deviceName: string
  device: string
  type: string
  data: any
}

interface ILight extends ISwitch, ICommander {
  get() : string
  set(value: string|boolean) : void
  turnOn() : void
  turnOff() : void
}

interface ILightFactory {
  (id : string, opts : any): ILight;
}

interface ILockManager {
  getInstance(id: string) : ISomeLock
}

interface ISomeLock extends ISwitch {
  set(value: boolean) : void
}

interface ILock {
  setLock(controllerId: string, lockId: string, value: boolean) : void
  getType() : string
}

declare enum LockState {
  'unknown', 'locked', 'unlocked'
}

interface IScene {
  id : string;
  name : string;
}

interface ICommandTypeMeta {

}

interface ScenesDict extends Dict<IScene> {}

interface Dict<T> {
  [key: string]: T
}

interface InstancesDict<T> {
  [key: string]: InstanceOrFactory<T>
}

declare type Func<T> = () => T;
declare type Factory<T> = Func<T>;
declare type InstanceOrFactory<T> = T | Factory<T>;

interface IClassFactory<T> {
  (instanceId: string, typeId: string, opts: any) :  T|Func<T>
}

interface IClassTypeFactory<T> {
  (id : string, opts : any) : T
}

interface ISensorManager {
  getInstance(instanceId: string) : ISensor
}

/**
  * Called after an instance has been added by a class type manager.
  * @callback ClassTypeManager.onAddInstance
  * @param {*} instance
  * @param {string} instanceId
  * @param {string} typeId
  * @param {Object} opts
  */
interface IOnAddInstanceCallback<T> {
  (instance: Func<T>, instanceId: string, typeId: string, opts: any): void
}

interface IConfig {
  hue?: any,
  instances?: InstanceConfig[],
  zones?: IZoneConfig[],
  locks?: ILockConfig[],
  people?: IPersonConfig[],
  dataPath?: string,
  webServerPort?: number,
  location?: IConfigCoords
}

interface InstanceConfig {
  id: string,
  class: string,
  type: string,
  options: any
}

interface ILockConfig {
  id: string,
  type: string,
  controller: string,
  lockId: string
}

interface IZoneConfig {
  id: string;
  name: string;
  faIcon: string;
  parent: string;
  timeout: number;
}

interface IPersonConfig {
  id: string;
  token: string;
}

interface IPresence {
  isPresent: boolean;
  add(id: string, opts: IPresenceOpts)
  set() : void
  clear() : void
  bump() : void
}

interface IPresenceOpts {
  category: string,
  name?: string,
  timeout: number,
  parent: string
}

interface IPersistence {
  set(key: string, value: any) : void;
}

interface IEventEmitter {
  emit(name: string, value: any)
  on(name: string, cb: Function)
}

interface IEventBus {
  emit(source: string, name: string, value: any)
  on(source: string, name: string, cb: Function)
}


interface ITriggerManager {
  add(typeId:string, instanceId:string, emitter?) : ITrigger
  getAll() : ITrigger[]
  get(typeId: string, instanceId: string) : ITrigger
  trigger(typeId: string, instanceId: string, data: any)
  onTrigger(typeId: string, instanceId: string, listener: Function)
}

interface IPresenceManager extends IEventEmitter {
  get(id): IPresence
  getAll(): IPresence[]
  add(id: string, opts: IPresenceOpts)
  bump(id: string)
  isPresent(id: string) : boolean
  addParent(childId: string, parentId: string) : void
  removeParent(childId: string, parentId: string) : void
}

interface IZone {
  id: string;
  name: string;
  faIcon: string;
  parent: IZone;
  parentId: string;
  children: IZone[];
}

interface IZoneManager {
  getMap() : Dict<IZone>
  getAll() : IZone[]
  get(id: string) : IZone
}

interface ILightsManager {

}

interface IStorageManager {

}

// /**
//  * @interface StateProvider
//  */
// interface StateProvider {
//   /**
//    * @member StateProvider#getCurrent
//    */
//    getCurrent();
//
//   /**
//    * @member StateProvider#setCurrent
//    */
//   setCurrent();
//
//   /**
//    * @member StateProvider#getAvailable
//    */
//   getAvailable();
// }

interface IValuesManager {
  addInstance(typeId: string, instanceId: string) : IValueStore
  getInstance(typeId: string, instanceId: string) : IValueStore
  set(typeId: string, instanceId: string, key: string, value: any) : void
  get(typeId: string, instanceId: string, key: string) : IValueStore
}

interface IValueStore {
  set(key: string, value: any) : void
  get(key: string) : any
  getAll() : Dict<any>
}

interface INodeREDContext {

}

interface INodeREDLauncher {
  start() : When.Promise<any>;
  reload() : void;
}

interface IFlow {
  type: string;
  id: string;
  label?: string;
  name?: string;
}

interface INodeREDScenes extends IEventEmitter {
  getCurrentFlow() : IFlow;
  saveCurrentFlow(data: IFlow) : void;
  changeFlow(newId: string) : void;
  getCurrent(): IFlow;
}

interface IWebServer {
  // TODO: how can we get Http.Server and Express.Router?
  server: any
  app: any
  start(): void
}

interface IConfigCoords {
  latitude?: number,
  longitude?: number
}

interface ISunlight {
  isDark() : boolean;
  isLight() : boolean;
  currentLight() : string;
  start() : void;
  stop() : void;
}

interface IValueStore {

}

interface IValuesManager {
    /**
    * Adds a new instance to the manager
    * @param {string} instanceId - unique ID for this instance
    * @param {Array<string>|string} types - array of switch type IDs to be applied to this instance
    */
    addInstance(typeId: string, instanceId: string) : IValueStore;

    /**
    * Gets an instance by it's type and ID
    * @param  {string} typeId
    * @param  {string} instanceId
    * @return {ValueStore}
    */
    getInstance(typeId: string, instanceId: string) : IValueStore;

    /**
    * Sets value
    * @param  {string} instanceId - the ID of the instance to set
    * @param  {string} typeId
    * @param  {string} key - the key
    * @param  {*} value  - the new value
    */
    set(typeId: string, instanceId: string, key: string, value: any) : void;

    /**
    * Gets value
    * @param  {string} instanceId - the ID of the instance to run a command on
    * @param  {string} typeId
    * @param  {string} key - the key
    * @return {*} the most recent value
    */
    get(typeId: string, instanceId: string, key: string) : any;
}
