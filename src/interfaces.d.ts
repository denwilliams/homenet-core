declare namespace Homenet {

  export interface IServiceContext {
    get<T>(type: string) : T
  }

  export interface IRuntime {
    start() : void
    get<T>(type: string) : T
    loadPlugin<T extends IPluginLoader>(ctor: IPluginCtor<T>)
  }

  export interface IPluginCtor<T extends IPluginLoader> {
      new(...args: any[]): T;
  }

  export interface IPluginLoader {
    load(): void
  }

  /**
   * Application
   */
  interface IApp {
    start() : void
  }


  interface IPlugins {
    add(loader: IPluginLoader)
    loadAll() : void
  }

  interface IWebApi {
    app: any;
  }

  interface ILogEventMessage {
    level: string,
    message: string
  }

  interface ILogEventHandler {
    (log: ILogEventMessage) : void
  }

  interface ILogger extends ILogTarget {
    onLog(handler: ILogEventHandler) : void
    info(args : any) : void
    warn(args : any) : void
    error(args : any) : void
    debug(args : any) : void
  }

  interface ILogTarget {
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

  interface ISwitch extends IEventSource {
    get() : any
    set(value: any) : void
  }

  interface ICommander {
  }

  interface ITrigger {
    lastTriggered: Date
    onTrigger(listener: Function) : void
    removeOnTriggerListener(listener: Function) : void
    trigger(data?: any) : void
  }

  interface IClassesManager {
    addClass<T>(classId: string, classFactory: IClassFactory<T>) : void
    addInstance<T>(classId: string, instanceId: string, typeId: string, opts: any) : void
    getInstance<T>(classId: string, instanceId: InstanceOrFactory<T>) : T
    initializeAll() : void
  }

  interface ISwitchManager {
    addType(typeId: string, switchFactory: ISwitchFactory) : void
    addInstance(typeId: string, instanceId: string, opts: any) : void
    getAllInstances() : Dict<ISwitch>
    getInstance(typeIdOrFullId: string, instanceId?: string): ISwitch
    set(typeId: string, instanceId: string, value: boolean|string|number) : any
    get(typeId: string, instanceId: string) : boolean|string|number
    // emitValue(typeId: string, instanceId: string, value: boolean|string|number) : void
  }

  interface ICommandManager {
    addType(typeId: string, factory: ICommanderFactory, meta: ICommandTypeMeta) : void
    addInstance(typeId: string, instanceId: string, opts: any) : void
    getInstance(fullId: string) : Homenet.ICommander
    getInstance(typeId: string, instanceId: string) : Homenet.ICommander
    getAll(): Homenet.Dict<Homenet.ICommander>
    getMeta(fullId: string): Homenet.ICommandTypeMeta
    getMeta(typeId: string, instanceId: string): Homenet.ICommandTypeMeta
    getTypeMeta(typeId) : Homenet.ICommandTypeMeta
    getType(typeId: string) : Homenet.ICommanderFactory
    run(typeId: string, instanceId: string, command: string, args?: any[]): Promise<any>
  }

  interface IStateManager {
    addType(typeId: string, provider: IStateProvider) : void
    getType(typeId: string) : IStateProvider
    getTypes() : Dict<IStateProvider>
    emitState(typeId: string, state: string) : void
    getCurrent(typeId: string) : Promise<string>;
    setCurrent(typeId: string, state:string) : Promise<string>;
    getAvailable(typeId: string): string[];
  }

  interface IStateProvider {
    emitOnSet?: boolean;
    getCurrent() : Promise<string>;
    setCurrent(state: string) : Promise<string>;
    getAvailable(): string[];
  }

  // interface TypeStateProvider<T> extends IStateProvider {
  //   getCurrent() : T;
  //   setCurrent(state:string|T) : void;
  // }

  interface ISceneManager {

    current : IScene;

    set(name: string) : void;
    onChanged(callback : Function) : void;

  }

  interface IClassManager<T> {
    getInstance(instanceId: string) : T
    getAllInstances(): Dict<Func<T>>
  }

  interface IClassTypeManager<T> extends IClassManager<T> {
    addType(typeId: string, factory: IClassTypeFactory<T>) : void
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

  interface IStatsTarget {
    gauge(id: string, value: number) : void
    counter(id: string, increment?: number) : void
  }

  interface IStatsManager extends IStatsTarget {
    /**
     * Registers a new stats target type
     * @param  {IStatsTarget} target
     */
    // register(target: IStatsTarget) : void
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

  type SensorEvent = 'trigger' | 'active' | 'value';

  interface ISensorOpts {
    zoneId?: string; // deprecated
    zone?: string;
    timeout?: number;
  }

  interface ISensor extends IEventSource {
    opts: ISensorOpts;
    isTrigger: boolean;
    isToggle: boolean;
    isValue: boolean;
    on(event: SensorEvent, cb: Function) : void;
  }

  interface IValueSensor extends ISensor {
    get(key: string, value: string) : void
    set(key: string, value: string) : void
  }

  interface ISensorOld {
    trigger(value?: any) : void;
    set(key, value) : void;
    onTrigger(cb: Function) : void;
    removeOnTriggerListener(cb: Function) : void;
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

  interface ILock extends ISwitch {
    // get() : boolean
    // set(value: boolean) : void
  }

  interface ILockCommander extends ICommander {
    lock() : void
    unlock() : void
  }

  interface ILight extends ISwitch {
    get() : string
    set(value: string|boolean) : void
    turnOn() : void
    turnOff() : void
  }

  interface ILightCommander extends ICommander {
    turnOn() : void
    turnOff() : void
  }

  interface ILightFactory {
    (id : string, opts : any): ILight
  }

  interface ILockManager extends IClassTypeManager<ILock> {
    // getInstance(id: string) : ISomeLock
    // addType(typeId: string, type: ILockType) : void
    // getType(typeId: string): ILockType
    setLock(lockId: string, value: boolean) : void
  }

  interface ISomeLock extends ISwitch {
    set(value: boolean) : void
  }

  export interface ILockType {
    setLock(controllerId: string, lockId: string, value: boolean) : void
    getType() : string
  }

  export enum LockState {
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

  export type FuncInOut<TIn, TOut> = (TIn) => TOut;
  export type Func<T> = () => T;
  export type Factory<T> = Func<T>;
  export type InstanceOrFactory<T> = T | Factory<T>;

  interface IClassFactory<T> {
    (instanceId: string, typeId: string, opts: any) :  T|Func<T>
  }

  interface IClassTypeFactory<T> {
    (id : string, opts : any) : T
  }

  interface ISensorManager extends IClassTypeManager<ISensor> {
    // trigger(sensorId: string) : void
  }


  // THIS IS NOW IN ClassTypeManager
  // /**
  //   * Called after an instance has been added by a class type manager.
  //   * @callback ClassTypeManager.onAddInstance
  //   * @param {*} instance
  //   * @param {string} instanceId
  //   * @param {string} typeId
  //   * @param {Object} opts
  //   */
  // interface IOnAddInstanceCallback<T> {
  //   (instance: Func<T>, instanceId: string, typeId: string, opts: any): void
  // }

  interface IConfig {
    hue?: any,
    instances?: InstanceConfig[],
    zones?: IZoneConfig[],
    scenes?: ISceneConfig[],
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

  interface ISceneConfig {
    id: string;
    name?: string;
  }

  interface IPersonConfig {
    id: string;
    name: string;
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
    timeout?: number,
    parent?: string
  }

  interface IPersistence {
    set(key: string, value: any) : Promise<any>;
    get(key: string) : Promise<any>;
  }

  interface IEventSource {
    on(name: string, cb: Function) : void;
    removeListener(name: string, cb: Function) : void;
  }

  interface IEventSender {
    emit(name: string, value: any)
  }

  interface IEventEmitter extends IEventSource, IEventSender {
  }

  interface IEventBus {
    emit(source: string, name: string, value: any)
    on(source: string, name: string, cb: Function)
    onAny(cb: Function)
  }


  interface ITriggerManager {
    add(typeId:string, instanceId:string, emitter?: IEventEmitter) : ITrigger
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
    addType(typeId: string, factory: ILightFactory): void
    getInstance(instanceId: string): ILight
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

  interface IValueStore {
    id: string
    set(key: string, value: any) : void
    get(key: string) : any
    getAll() : Dict<any>
    waitReady(): Promise<void>
  }

  interface INodeREDContext {
    logger: Homenet.ILogger;
    services: Homenet.IServiceContext;
    switches: Homenet.ISwitchManager;
    sensors: Homenet.ISensorManager;
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

  interface ISunlight extends IEventSource {
    /**
     * Returns true if it is currently dark in the specified coordinates
     */
    isDark() : boolean;

    /**
     * Returns true if it is currently light in the specified coordinates
     */
    isLight() : boolean;

    /**
     * Returns the current light state (light/dark)
     */
    currentLight() : string;

    /**
     * Starts monitoring for light changes (fires events when light->dark->light)
     */
    start() : void;

    /**
     * Stops monitoring for light changes
     */
    stop() : void;

    /**
     * Gets the current light state (light/dark)
     */
    current: string;
  }






  // interface ISunlightState {
  //   isLight: boolean;
  //   primaryState: string;
  // }

  interface IValueStore {}

  interface IInstanceLoader {
    loadInstances(config: IConfig) : void
  }

  interface IPerson extends ISwitch {
    id: string;
    name: string;
    presence: boolean;

    bump() : void

    /**
     * @implements Switch#set
     */
    set(isPresent: boolean) : void

    /**
     * @implements Switch#get
     */
    get() : boolean
  }

  interface IPersonManager {
    add(id: string, name: string, timeout: number): IPerson;
    get(id): IPerson
  }

  interface IValuesManager {
    addInstance(typeId: string, instanceId: string) : IValueStore
    getInstance(typeId: string, instanceId: string) : IValueStore
    set(typeId: string, instanceId: string, key: string, value: any) : void
    get(typeId: string, instanceId: string, key: string) : IValueStore
    waitReady(typeId: string, instanceId: string) : Promise<void>;

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
      getInstance(typeOrFullId: string, instanceId?: string) : IValueStore;

      getAllInstances() : Homenet.IValueStore[];

      getInstances(type: string) : Homenet.IValueStore[];

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

  interface INodeRed {
    start() : void;
    getSceneManager() : any;
  }

  export interface IWebDependencies {
    logger: ILogger;
    config: IConfig;
    triggers: ITriggerManager;
    switches: ISwitchManager;
    commands: ICommandManager;
    states: IStateManager;
    sunlight: ISunlight;
    sensors: ISensorManager;
    presence: IPresenceManager;
    locks: ILockManager;
    lights: ILightsManager;
    scene: ISceneManager;
    values: IValuesManager;
    zones: IZoneManager;
    authorization: IAuthorizer;
  }
}
