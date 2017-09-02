declare module '@homenet/core' {
  export function plugin(): (typeConstructor: any) => void;
  export function service(serviceIdentifier: (string)): (target: any, targetKey: string, index?: number) => any;
  export function init(RED: any, config: IConfig): IRuntime;
  export function registerLogger(CustomLogger: new(...args: any[]) => ILogTarget);
  export function registerStats(CustomStats: new(...args: any[]) => IStatsTarget);

  namespace When {
    export interface Promise<T> {
      catch<U>(onRejected?: (reason: any) => U | Promise<U>): Promise<U>;

      catch<U>(filter: (reason: any) => boolean, onRejected?: (reason: any) => U | Promise<U>): Promise<U>;

      // Make sure you test any usage of these overloads, exceptionType must
      // be a constructor with prototype set to an instance of Error.
      catch<U>(exceptionType: any, onRejected?: (reason: any) => U | Promise<U>): Promise<U>;

      finally(onFulfilledOrRejected: Function): Promise<T>;

      ensure(onFulfilledOrRejected: Function): Promise<T>;

      // inspect(): Snapshot<T>;

      yield<U>(value: U | Promise<U>): Promise<U>;

      else(value: T): Promise<T>;
      orElse(value: T): Promise<T>;

      tap(onFulfilledSideEffect: (value: T) => void): Promise<T>;

      delay(milliseconds: number): Promise<T>;

      timeout(milliseconds: number, reason?: any): Promise<T>;

      with(thisArg: any): Promise<T>;
      withThis(thisArg: any): Promise<T>;

      otherwise<U>(onRejected?: (reason: any) => U | Promise<U>): Promise<U>;

      otherwise<U>(predicate: (reason: any) => boolean, onRejected?: (reason: any) => U | Promise<U>): Promise<U>;

      // Make sure you test any usage of these overloads, exceptionType must
      // be a constructor with prototype set to an instance of Error.
      otherwise<U>(exceptionType: any, onRejected?: (reason: any) => U | Promise<U>): Promise<U>;

      then<U>(onFulfilled: (value: T) => U | Promise<U>, onRejected?: (reason: any) => U | Promise<U>, onProgress?: (update: any) => void): Promise<U>;

      // spread<T>(onFulfilled: _.Fn0<Promise<T> | T>): Promise<T>;
      // spread<A1, T>(onFulfilled: _.Fn1<A1, Promise<T> | T>): Promise<T>;
      // spread<A1, A2, T>(onFulfilled: _.Fn2<A1, A2, Promise<T> | T>): Promise<T>;
      // spread<A1, A2, A3, T>(onFulfilled: _.Fn3<A1, A2, A3, Promise<T> | T>): Promise<T>;
      // spread<A1, A2, A3, A4, T>(onFulfilled: _.Fn4<A1, A2, A3, A4, Promise<T> | T>): Promise<T>;
      // spread<A1, A2, A3, A4, A5, T>(onFulfilled: _.Fn5<A1, A2, A3, A4, A5, Promise<T> | T>): Promise<T>;

      done<U>(onFulfilled: (value: T) => void, onRejected?: (reason: any) => void): void;

      fold<U, V>(combine: (value1: T, value2: V) => U | Promise<U>, value2: V | Promise<V>): Promise<U>;
    }
  }

  namespace Q {
    export interface IPromise<T> {
      then<U>(onFulfill?: (value: T) => U | IPromise<U>, onReject?: (error: any) => U | IPromise<U>): IPromise<U>;
    }

    export interface Promise<T> {
      /**
       * Like a finally clause, allows you to observe either the fulfillment or rejection of a promise, but to do so without modifying the final value. This is useful for collecting resources regardless of whether a job succeeded, like closing a database connection, shutting a server down, or deleting an unneeded key from an object.

        * finally returns a promise, which will become resolved with the same fulfillment value or rejection reason as promise. However, if callback returns a promise, the resolution of the returned promise will be delayed until the promise returned from callback is finished.
        */
      fin(finallyCallback: () => any): Promise<T>;
      /**
       * Like a finally clause, allows you to observe either the fulfillment or rejection of a promise, but to do so without modifying the final value. This is useful for collecting resources regardless of whether a job succeeded, like closing a database connection, shutting a server down, or deleting an unneeded key from an object.

        * finally returns a promise, which will become resolved with the same fulfillment value or rejection reason as promise. However, if callback returns a promise, the resolution of the returned promise will be delayed until the promise returned from callback is finished.
        */
      finally(finallyCallback: () => any): Promise<T>;

      /**
       * The then method from the Promises/A+ specification, with an additional progress handler.
       */
      then<U>(onFulfill?: (value: T) => U | IPromise<U>, onReject?: (error: any) => U | IPromise<U>, onProgress?: Function): Promise<U>;

      /**
       * Like then, but "spreads" the array into a variadic fulfillment handler. If any of the promises in the array are rejected, instead calls onRejected with the first rejected promise's rejection reason.
       *
       * This is especially useful in conjunction with all
       */
      spread<U>(onFulfill: (...args: any[]) => IPromise<U> | U, onReject?: (reason: any) => IPromise<U> | U): Promise<U>;

      fail<U>(onRejected: (reason: any) => U | IPromise<U>): Promise<U>;

      /**
       * A sugar method, equivalent to promise.then(undefined, onRejected).
       */
      catch<U>(onRejected: (reason: any) => U | IPromise<U>): Promise<U>;

      /**
       * A sugar method, equivalent to promise.then(undefined, undefined, onProgress).
       */
      progress(onProgress: (progress: any) => any): Promise<T>;

      /**
       * Much like then, but with different behavior around unhandled rejection. If there is an unhandled rejection, either because promise is rejected and no onRejected callback was provided, or because onFulfilled or onRejected threw an error or returned a rejected promise, the resulting rejection reason is thrown as an exception in a future turn of the event loop.
       *
       * This method should be used to terminate chains of promises that will not be passed elsewhere. Since exceptions thrown in then callbacks are consumed and transformed into rejections, exceptions at the end of the chain are easy to accidentally, silently ignore. By arranging for the exception to be thrown in a future turn of the event loop, so that it won't be caught, it causes an onerror event on the browser window, or an uncaughtException event on Node.js's process object.
       *
       * Exceptions thrown by done will have long stack traces, if Q.longStackSupport is set to true. If Q.onerror is set, exceptions will be delivered there instead of thrown in a future turn.
       *
       * The Golden Rule of done vs. then usage is: either return your promise to someone else, or if the chain ends with you, call done to terminate it.
       */
      done(onFulfilled?: (value: T) => any, onRejected?: (reason: any) => any, onProgress?: (progress: any) => any): void;

      /**
       * If callback is a function, assumes it's a Node.js-style callback, and calls it as either callback(rejectionReason) when/if promise becomes rejected, or as callback(null, fulfillmentValue) when/if promise becomes fulfilled. If callback is not a function, simply returns promise.
       */
      nodeify(callback: (reason: any, value: any) => void): Promise<T>;

      /**
       * Returns a promise to get the named property of an object. Essentially equivalent to
       *
       * promise.then(function (o) {
       *     return o[propertyName];
       * });
       */
      get<U>(propertyName: String): Promise<U>;
      set<U>(propertyName: String, value: any): Promise<U>;
      delete<U>(propertyName: String): Promise<U>;
      /**
       * Returns a promise for the result of calling the named method of an object with the given array of arguments. The object itself is this in the function, just like a synchronous method call. Essentially equivalent to
       *
       * promise.then(function (o) {
       *     return o[methodName].apply(o, args);
       * });
       */
      post<U>(methodName: String, args: any[]): Promise<U>;
      /**
       * Returns a promise for the result of calling the named method of an object with the given variadic arguments. The object itself is this in the function, just like a synchronous method call.
       */
      invoke<U>(methodName: String, ...args: any[]): Promise<U>;
      fapply<U>(args: any[]): Promise<U>;
      fcall<U>(...args: any[]): Promise<U>;

      /**
       * Returns a promise for an array of the property names of an object. Essentially equivalent to
       *
       * promise.then(function (o) {
       *     return Object.keys(o);
       * });
       */
      keys(): Promise<string[]>;

      /**
       * A sugar method, equivalent to promise.then(function () { return value; }).
       */
      thenResolve<U>(value: U): Promise<U>;
      /**
       * A sugar method, equivalent to promise.then(function () { throw reason; }).
       */
      thenReject(reason: any): Promise<T>;

      /**
       * Attaches a handler that will observe the value of the promise when it becomes fulfilled, returning a promise for that same value, perhaps deferred but not replaced by the promise returned by the onFulfilled handler.
       */
      tap(onFulfilled: (value: T) => any): Promise<T>;

      timeout(ms: number, message?: string): Promise<T>;
      /**
       * Returns a promise that will have the same result as promise, but will only be fulfilled or rejected after at least ms milliseconds have passed.
       */
      delay(ms: number): Promise<T>;

      /**
       * Returns whether a given promise is in the fulfilled state. When the static version is used on non-promises, the result is always true.
       */
      isFulfilled(): boolean;
      /**
       * Returns whether a given promise is in the rejected state. When the static version is used on non-promises, the result is always false.
       */
      isRejected(): boolean;
      /**
       * Returns whether a given promise is in the pending state. When the static version is used on non-promises, the result is always false.
       */
      isPending(): boolean;

      valueOf(): any;

      /**
       * Returns a "state snapshot" object, which will be in one of three forms:
       *
       * - { state: "pending" }
       * - { state: "fulfilled", value: <fulfllment value> }
       * - { state: "rejected", reason: <rejection reason> }
       */
      // inspect(): PromiseState<T>;
    }
  }


  export interface IServiceContext {
    get<T>(type: string) : T
  }

  export interface IRuntime {
    start() : void
    get<T>(type: string) : T
    loadPlugin<T extends IPluginLoader>(ctor: IPluginCtor<T>): void
  }
  export interface IPluginAnnotate {
    plugin(): (typeConstructor: any) => void;
    service(serviceIdentifier: (string)): (target: any, targetKey: string, index?: number) => any;
  }

  export interface IPluginCtor<T extends IPluginLoader> {
      new(...args: any[]): T;
  }

  export interface IPluginLoader {
    load(): void | Promise<void>
  }

  /**
   * Application
   */
  interface IApp {
    start() : void
  }

  interface IPlugins {
    add(loader: IPluginLoader): void
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
    (log: ILogEventMessage): void
  }

  interface ILogger extends ILogTarget {
    onLog(handler: ILogEventHandler) : void
    info(args : any): void
    warn(args : any): void
    error(args : any): void
    debug(args : any): void
  }

  interface ILogTarget {
    info(args : any): void
    warn(args : any): void
    error(args : any): void
    debug(args : any): void
  }

  interface ICommon {
    logger: ILogger;
    config: IConfig;
    eventBus: IEventBus;
    notifications: INotificationsManager;
    storage: IStorageManager;
  }

  interface IAuthorizer {
    authorize(token: string): Q.Promise<string>;
  }

  interface ILoggerFactory {
    getLogger(name: string): ILogger
  }

  interface ISwitch extends ISettable {}

  interface ICommander {}

  interface ITrigger {
    lastTriggered: Date
    onTrigger(listener: Function): void
    removeOnTriggerListener(listener: Function): void
    trigger(data?: any): void
  }

  interface IClassesManager {
    addClass<T>(classId: string, classFactory: IClassFactory<T>): void
    addInstance<T>(classId: string, instanceId: string, typeId: string, opts: any): void
    getInstance<T>(classId: string, instanceId: InstanceOrFactory<T>): T
    getInstances(): any[]
    getInstancesDetails(): any[]
    initializeAll(): void
  }

  interface ISwitchManager {
    addInstance(id: string, sw: ISwitch): void
    getAllInstances(): Dict<ISwitch>
    getInstance(id: string): ISwitch
    set(id: string, value: boolean|string|number): any
    get(id: string): boolean|string|number
  }

  interface ICommandManager {
    addInstance(id: string, commander: ICommander, meta: ICommandTypeMeta) : void
    getInstance(id: string) : ICommander
    getAll(): Dict<ICommander>
    getMeta(id: string): ICommandTypeMeta
    run(id: string, command: string, args?: any[]): Promise<any>
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

  interface ISceneManager {
    current : IScene;

    set(name: string) : void;
    onChanged(callback : Function) : void;
  }

  interface IClassManager<T> {
    getInstance(instanceId: string) : T
    getAllInstances(): Dict<T>
  }

  interface IClassTypeManager<T> extends IClassManager<T> {
    addType(typeId: string, factory: IClassTypeFactory<T>) : void
  }

  interface ISettableClassTypeManager<T> extends IClassTypeManager<T> {
    addSettableType(typeId: string, factory: IClassTypeFactory<ISettable>): void
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
    send(severity: string, msgTxt: string, msgHtml?: string) : void
  }

  interface INotifier {
    notify(severity: string, msgTxt: string, msgHtml?: string) : void;
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

  interface IButton {
    onClick(cb: Function)
    onDoubleClick(cb: Function)
    onHold(cb: Function)
  }

  interface IBaseSensorArgs {}

  interface ISensorEventArgs {
    deviceName: string
  }

  interface IDeviceEventArgs {
    deviceName: string
    device: string
    type: string
    data: any
  }

  interface ISettable {
    get() : any
    set(value: any) : void
    on(name: 'update', cb: (value: any) => void) : void;
    removeListener(name: 'update', cb: (value: any) => void) : void;
  }

  interface ILockCommander extends ICommander {
    lock() : void
    unlock() : void
  }

  interface ILock extends ISwitch, ILockCommander {}

  interface IHvacCommander extends ICommander {
    turnOn() : void
    turnOff() : void
  }

  interface IHvac extends ISwitch, IHvacCommander {}

  interface ILightCommander extends ICommander {
    turnOn() : void
    turnOff() : void
  }

  interface ILight extends ISwitch, ILightCommander {}

  interface ILockManager extends ISettableClassTypeManager<ILock> {
    setLock(lockId: string, value: boolean) : void
  }

  export interface ILockType {
    setLock(controllerId: string, lockId: string, value: boolean) : void
    getType() : string
  }

  export enum LockState {
    'unknown', 'locked', 'unlocked'
  }

  interface IMacroCommander extends ICommander {
    execute(): void;
  }

  interface IBaseMacro {}

  interface IMacro extends IMacroCommander, IBaseMacro {}

  interface IMacroSwitchCommander extends ICommander {
    turnOn(): void;
    turnOff(): void;
  }

  interface IMacroSwitch extends ISwitch, IMacroSwitchCommander, IBaseMacro {}

  interface IMacroManager extends IClassManager<IBaseMacro> {
    execute(macroId: string): void;
    turnOn(macroId: string): void;
    turnOff(macroId: string): void;
  }

  interface IScene {
    id : string;
    name : string;
  }

  interface ICommandTypeMeta {}

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
    (instanceId: string, typeId: string, opts: any) : T
  }

  interface IClassTypeFactory<T> {
    (id : string, opts : any) : T
  }

  interface ISensorManager extends IClassTypeManager<ISensor> {
    // trigger(sensorId: string) : void
  }

  interface IButtonManager extends IClassTypeManager<IButton> {}

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
    redis?: {
      host: string;
    }
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
    parent?: string;
    timeout?: number;
    /**
     * Path to temperature value, eg: 'lounge-sensor:temperatue'
     */
    temperature?: string;
    /**
     * Path to humidity value, eg: 'lounge-sensor:humidity'
     */
    humidity?: string;
    /**
     * Path to string value, eg: 'lounge-sensor:luminescence'
     */
    luminescence?: string;
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
    removeListener(source:string, event:string, registeredCb:Function)
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
    parent: IZone;
    parentId: string;
    children: IZone[];
  }

  interface IZoneManager {
    getMap() : Dict<IZone>
    getAll() : IZone[]
    get(id: string) : IZone
  }

  /**
   * The easiest way to implement a light provider/type is to implement an ISettable.
   *
   * The ISettable should provide functions to `set` and `get` the current light state.
   * It should also emit an `update` event when the light state changes.
   * For simple providers this may just occur when `set` is called.
   * For more advanced providers this may occur by reading the state of the actual device.
   * This allows for homenet to update it's state when a light is set through a physical
   * switch or unrelated app.
   * ILightsManager will automatically provide `turnOn` and `turnOff` commands which will
   * proxy to the ISettable's `set` method with a value of true or false respectively.
   * Include an ISettable light type by calling `addSettableType`.
   *
   * Alternatively, a custom `turnOn` and `turnOff` command can be implemented as an ILight.
   * Include an ILight light type by calling `addType`.
   */
  interface ILightsManager extends ISettableClassTypeManager<ILight> {}

  interface IHvacManager extends ISettableClassTypeManager<IHvac> {}

  interface IStorageManager {}

  interface IValueStore {
    id: string
    set(key: string, value: any) : void
    get(key: string) : any
    getAll() : Dict<any>
    waitReady(): Promise<void>
  }

  interface INodeREDContext {
    logger: ILogger;
    services: IServiceContext;
    switches: ISwitchManager;
    sensors: ISensorManager;
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

      getAllInstances() : IValueStore[];

      getInstances(type: string) : IValueStore[];

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
    classesManager: IClassesManager,
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
