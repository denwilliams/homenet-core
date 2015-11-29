/// <reference path="../typings/q/Q.d.ts" />

interface Logger {
  info(args : any) : void
  warn(args : any) : void
  error(args : any) : void
  debug(args : any) : void
}

interface Switch {
  emitOnSet: boolean
  emitValue(value: boolean|string|number) : void
  get() : any // : Q.Promise<any>
  set(value: any) : void // : Q.Promise<void>
}

interface Commander {
  
}

interface Trigger {
  
}

interface LightsModule {
  
}

interface ClassesManager {
  addClass<T>(classId: string, classFactory: ClassFactory<T>) : void 
}

interface SwitchManager {
  addType(typeId: string, switchFactory: SwitchFactory) : void
  addInstance(typeId: string, instanceId: string, opts: any) : void
  getAllInstances() : Dict<Switch>
  getInstance(typeId: string, instanceId: string): Switch
  set(typeId: string, instanceId: string, value: boolean|string|number) : any
  get(typeId: string, instanceId: string) : boolean|string|number
  emitValue(typeId: string, instanceId: string, value: boolean|string|number) : void
}

interface CommandManager {
  addType(typeId: string, factory: CommanderFactory, meta: CommandTypeMeta) : void
  addInstance(typeId: string, instanceId: string, opts: any) : void
}

interface SwitchInstanceProvider {
  () : Switch
}

interface SwitchFactory {
  (opts: any) : Switch
}

interface CommanderFactory {
  (opts: any) : Commander
}

interface Light extends Switch, Commander {
  get() : string
  set(value: string|boolean) : void
  turnOn() : void
  turnOff() : void
}

interface LightFactory {
  (id : string, opts : any): Light;
}

interface Lock {
  setLock(controllerId: string, lockId: string, value: boolean) : void
  getType() : string
}

declare enum LockState {
  'unknown', 'locked', 'unlocked'
}

interface Scene {
  id : string;
  name : string;
}

interface CommandTypeMeta {
  
}

interface ScenesDict extends Dict<Scene> {}

interface Dict<T> {
  [key: string]: T
}

interface InstancesDict<T> {
  [key: string]: InstanceOrFactory<T>  
}

declare type Func<T> = () => T;
declare type Factory<T> = Func<T>;
declare type InstanceOrFactory<T> = T | Factory<T>; 

interface ClassFactory<T> {
  (instanceId: string, typeId: string, opts: any) :  T|Func<T>
}

interface ClassTypeFactory<T> {
  (id : string, opts : any) : T
}

/**
  * Called after an instance has been added by a class type manager.
  * @callback ClassTypeManager.onAddInstance
  * @param {*} instance
  * @param {string} instanceId
  * @param {string} typeId
  * @param {Object} opts
  */
interface OnAddInstanceCallback<T> {
  (instance: Func<T>, instanceId: string, typeId: string, opts: any): void
}

interface Config {
  hue: any,
  zones: ZoneConfig[],
  locks: LockConfig[]
}

interface LockConfig {
  id: string,
  type: string,
  controller: string,
  lockId: string
}

interface ZoneConfig {
  id: string;
  name: string;
  faIcon: string;
  parent: string;
  timeout: number;
}

interface Presence {
  isPresent: boolean;
  add(id: string, opts: PresenceOpts)
}

interface PresenceOpts {
  category: string,
  name: string,
  timeout: number,
  parent: string
}

interface Storage {
  set(key: string, value: any);
}

interface EventEmitter {
  emit(name: string)
  on()
}

interface EventBus {
  emit(source: string, name: string, value: any)  
}
