declare module 'homenet-core' {
  export function plugin(): (typeConstructor: any) => void;
  export function service(serviceIdentifier: (string)): (target: any, targetKey: string, index?: number) => any;
  export function init(RED: any, config: IConfig): IRuntime;
  // export declare abstract class BaseSwitch<T> implements ISwitch {
  //     private _id;
  //     private _value;
  //     constructor(id: string, emitOnSet: boolean);
  //     get(): T;
  //     set(value: T): void;
  //
  //     // event emitter
  //     on(name: string, cb: Function);
  //     emit(name: string, value: any);
  // }
  export type SensorMode = 'toggle' | 'trigger';
  export class BaseSensor implements ISensor {
      id: string;
      mode: SensorMode;
      private _trigger;
      private _values;
      private _presence;
      constructor(instanceId: string, opts: {
          mode?: SensorMode;
          timeout?: number;
          zone?: string;
      }, triggers: ITriggerManager, presence: IPresenceManager, values: IValuesManager);
      trigger(): void;
      on(): void;
      off(): void;
      set(key: any, value: any): void;
      get(key: any): any;
      getAll(): Dict<any>;
  }
  export class TriggerSensor extends BaseSensor {
      constructor(instanceId: string, opts: {
          timeout?: number;
          zone?: string;
      }, triggers: ITriggerManager, presence: IPresenceManager, values: IValuesManager);
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

  export interface IApp {
    start() : void
  }

  interface IPlugins {
    add(loader: IPluginLoader)
    loadAll() : void
  }

  export interface IWebApi {
    app: any;
  }

  export interface ILogger {
    info(args : any) : void
    warn(args : any) : void
    error(args : any) : void
    debug(args : any) : void
  }

  export interface ICommon {
    logger: ILogger;
    config: IConfig;
    eventBus: IEventBus;
    notifications: INotificationsManager;
    storage: IStorageManager;
  }

  export interface IAuthorizer {
    authorize(token: string) : Q.Promise<string>;
  }

  export interface ILoggerFactory {
    getLogger(name: string) : ILogger
  }

  export interface ISwitch extends IEventSource {
    get() : any
    set(value: any) : void
  }

  export interface ICommander {
  }

  export interface ITrigger {
    lastTriggered: Date
    onTrigger(listener: Function) : void
    trigger(data?: any) : void
  }

    export interface IClassesManager {
      addClass<T>(classId: string, classFactory: IClassFactory<T>) : void
      addInstance<T>(classId: string, instanceId: string, typeId: string, opts: any) : void
      getInstance<T>(classId: string, instanceId: InstanceOrFactory<T>) : T
      initializeAll() : void
    }

    export interface ISwitchManager {
      addType(typeId: string, switchFactory: ISwitchFactory) : void
      addInstance(typeId: string, instanceId: string, opts: any) : void
      getAllInstances() : Dict<ISwitch>
      getInstance(typeId: string, instanceId: string): ISwitch
      set(typeId: string, instanceId: string, value: boolean|string|number) : any
      get(typeId: string, instanceId: string) : boolean|string|number
      // emitValue(typeId: string, instanceId: string, value: boolean|string|number) : void
    }

    export interface ICommandManager {
      addType(typeId: string, factory: ICommanderFactory, meta: ICommandTypeMeta) : void
      addInstance(typeId: string, instanceId: string, opts: any) : void
    }

    export interface IStateManager {
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

    export interface TypeStateProvider<T> extends IStateProvider {
      getCurrent() : T;
      setCurrent(state:string|T) : void;
    }

    export interface ISceneManager {

      current : IScene;

      set(name: string) : void;
      onChanged(callback : Function) : void;

    }

    export interface IClassManager<T> {
      getInstance(instanceId: string) : T
      getAllInstances(): Dict<Func<T>>
    }

    export interface IClassTypeManager<T> extends IClassManager<T> {
      addType(typeId: string, factory: IClassTypeFactory<T>) : void
    }

    export interface ISwitchInstanceProvider {
      () : ISwitch
    }

    export interface ISwitchFactory {
      (opts: any) : ISwitch
    }

    export interface ICommanderFactory {
      (opts: any) : ICommander
    }

    export interface INotificationsManager {
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

    export interface INotifier {
      notify(severity: string, msgTxt: string, msgHtml: [string]) : void;
    }


    export interface ISensor {
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


    export interface IBaseSensorArgs {

    }

    export interface ISensorEventArgs {
      deviceName: string
    }

    export interface IDeviceEventArgs {
      deviceName: string
      device: string
      type: string
      data: any
    }

    export interface ILock extends ISwitch {
      // get() : boolean
      // set(value: boolean) : void
    }

    export interface ILockCommander extends ICommander {
      lock() : void
      unlock() : void
    }

    export interface ILight extends ISwitch {
      get() : string
      set(value: string|boolean) : void
      turnOn() : void
      turnOff() : void
    }

    export interface ILightCommander extends ICommander {
      turnOn() : void
      turnOff() : void
    }

    export interface ILightFactory {
      (id : string, opts : any): ILight
    }

    export interface ILockManager extends IClassTypeManager<ILock> {
      // getInstance(id: string) : ISomeLock
      // addType(typeId: string, type: ILockType) : void
      // getType(typeId: string): ILockType
      setLock(lockId: string, value: boolean) : void
    }

    export interface ISomeLock extends ISwitch {
      set(value: boolean) : void
    }

    export interface ILockType {
      setLock(controllerId: string, lockId: string, value: boolean) : void
      getType() : string
    }

    export enum LockState {
      'unknown', 'locked', 'unlocked'
    }

    export interface IScene {
      id : string;
      name : string;
    }

    export interface ICommandTypeMeta {

    }

    export interface ScenesDict extends Dict<IScene> {}

    export interface Dict<T> {
      [key: string]: T
    }

    export interface InstancesDict<T> {
      [key: string]: InstanceOrFactory<T>
    }

    export type Func<T> = () => T;
    export type Factory<T> = Func<T>;
    export type InstanceOrFactory<T> = T | Factory<T>;

    export interface IClassFactory<T> {
      (instanceId: string, typeId: string, opts: any) :  T|Func<T>
    }

    export interface IClassTypeFactory<T> {
      (id : string, opts : any) : T
    }

    export interface ISensorManager extends IClassTypeManager<ISensor> {
      trigger(sensorId: string) : void
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

    export interface IConfig {
      hue?: any,
      instances?: InstanceConfig[],
      zones?: IZoneConfig[],
      locks?: ILockConfig[],
      people?: IPersonConfig[],
      dataPath?: string,
      webServerPort?: number,
      location?: IConfigCoords
    }

    export interface InstanceConfig {
      id: string,
      class: string,
      type: string,
      options: any
    }

    export interface ILockConfig {
      id: string,
      type: string,
      controller: string,
      lockId: string
    }

    export interface IZoneConfig {
      id: string;
      name: string;
      faIcon: string;
      parent: string;
      timeout: number;
    }

    export interface IPersonConfig {
      id: string;
      token: string;
    }

    export interface IPresence {
      isPresent: boolean;
      add(id: string, opts: IPresenceOpts)
      set() : void
      clear() : void
      bump() : void
    }

    export interface IPresenceOpts {
      category: string,
      name?: string,
      timeout?: number,
      parent?: string
    }

    interface IPersistence {
      set(key: string, value: any) : void;
    }

    export interface IEventSource {
      on(name: string, cb: Function)
    }

    export interface IEventSender {
      emit(name: string, value: any)
    }

    interface IEventEmitter extends IEventSource, IEventSender {
    }

    export interface IEventBus {
      emit(source: string, name: string, value: any)
      on(source: string, name: string, cb: Function)
    }


    export interface ITriggerManager {
      add(typeId:string, instanceId:string, emitter?) : ITrigger
      getAll() : ITrigger[]
      get(typeId: string, instanceId: string) : ITrigger
      trigger(typeId: string, instanceId: string, data: any)
      onTrigger(typeId: string, instanceId: string, listener: Function)
    }

    export interface IPresenceManager extends IEventEmitter {
      get(id): IPresence
      getAll(): IPresence[]
      add(id: string, opts: IPresenceOpts)
      bump(id: string)
      isPresent(id: string) : boolean
      addParent(childId: string, parentId: string) : void
      removeParent(childId: string, parentId: string) : void
    }

    export interface IZone {
      id: string;
      name: string;
      faIcon: string;
      parent: IZone;
      parentId: string;
      children: IZone[];
    }

    export interface IZoneManager {
      getMap() : Dict<IZone>
      getAll() : IZone[]
      get(id: string) : IZone
    }

    export interface ILightsManager {
      addType(typeId: string, factory: ILightFactory): void
      getInstance(instanceId: string): ILight
    }

    export interface IStorageManager {

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

    export interface IValuesManager {
      addInstance(typeId: string, instanceId: string) : IValueStore
      getInstance(typeId: string, instanceId: string) : IValueStore
      set(typeId: string, instanceId: string, key: string, value: any) : void
      get(typeId: string, instanceId: string, key: string) : IValueStore
    }

    export interface IValueStore {
      set(key: string, value: any) : void
      get(key: string) : any
      getAll() : Dict<any>
    }

    export interface IServiceContext {
      get<T>(type: string) : T
    }

    export interface INodeREDContext {
      logger: ILogger;
      services: IServiceContext;
      switches: ISwitchManager;
      sensors: ISensorManager;
    }

    export interface INodeREDLauncher {
      start() : When.Promise<any>;
      reload() : void;
    }

    export interface IFlow {
      type: string;
      id: string;
      label?: string;
      name?: string;
    }

    export interface INodeREDScenes extends IEventEmitter {
      getCurrentFlow() : IFlow;
      saveCurrentFlow(data: IFlow) : void;
      changeFlow(newId: string) : void;
      getCurrent(): IFlow;
    }

    export interface IWebServer {
      // TODO: how can we get Http.Server and Express.Router?
      server: any
      app: any
      start(): void
    }

    export interface IConfigCoords {
      latitude?: number,
      longitude?: number
    }

    export interface ISunlight {
      isDark() : boolean;
      isLight() : boolean;
      currentLight() : string;
      start() : void;
      stop() : void;
      current: ISunlightState;
    }

    export interface ISunlightState {
      isLight: boolean;
      primaryState: string;
    }

    export interface IValueStore {

    }

    export interface IInstanceLoader {
      loadInstances(config: IConfig) : void
    }


    export interface IValuesManager {
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

    export interface INodeRed {
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
      zones: IZoneManager;
      authorization: IAuthorizer;
    }





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


}
