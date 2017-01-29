import { lazySingleton, eagerSingleton } from './lifecycle';
import chalk = require('chalk');
import { injectable } from 'inversify';

/**
 * Manages instances of a specific class
 * @class
 * @param {string} classId
 * @param {ClassTypeManager.onAddInstance} onAddInstance
 * @param {Logger} logger
 */
@injectable()
export abstract class ClassTypeManager<T> implements Homenet.IClassTypeManager<T> {

  private instances: Homenet.Dict<T>;
  protected types: Homenet.Dict<Homenet.IClassTypeFactory<T>>;

  constructor(public classId: string, classes: Homenet.IClassesManager, protected logger: Homenet.ILogger) {
    const self = this;

    if (!classId) throw new Error('classId cannot be null');
    if (!logger) throw new Error('logger cannot be null');

    const instances: Homenet.Dict<T> = {};
    const types: Homenet.Dict<any> = {};

    this.types = types;
    this.instances = instances;

    logger.info(`Starting ${classId} manager`);
    this.addToClasses(classes);
  }

  /**
   * Adds this type manager instance to the classes module
   * @param {ClassesManager} classes - classes module
   */
  addToClasses(classes: Homenet.IClassesManager) {
    classes.addClass(this.classId, this.addInstance.bind(this));
  }

  /**
   * Adds a new light type
   * @param {string} typeId  - ID of the type
   * @param {function} factory -
   */
  addType(typeId: string, factory: Homenet.IClassTypeFactory<T>) {
    this.logger.info('Adding ' + chalk.blue(this.classId) + ' type ' + chalk.cyan(typeId));
    this.types[typeId] = factory;
  }

  /**
   * [getInstance description]
   * @param  {string} instanceId
   * @return {*} the instance
   */
  getInstance(instanceId: string) : T {
    const instance = this.instances[instanceId];
    if (instance) return instance;
    this.logger.warn('Cannot find instance ' + instanceId);
    return null;
  }

  /**
   * Gets all added instances
   * @return {Object<string,*>} an array of instances
   * @todo call factory methods
   */
  getAllInstances(): Homenet.Dict<T> {
    return this.instances;
  }

  /**
   * Called after an instance has been added by a class type manager.
   * @callback ClassTypeManager.onAddInstance
   * @param {*} instance
   * @param {string} instanceId
   * @param {string} typeId
   * @param {Object} opts
   */
  protected abstract onAddInstance(instance: T, instanceId: string, typeId: string, opts: any): void;

  private createInstance(typeId: string, instanceId: string, opts: any) : T {
    this.logger.info(`Creating ${chalk.cyan(this.classId)} instance of type ${chalk.cyan(typeId)} with ID ${chalk.green(instanceId)}`);
    const typeFactory: Homenet.IClassTypeFactory<T> = this.types[typeId];
    return typeFactory(instanceId, opts);
  }

  private addInstance(instanceId: string, typeId: string, opts: any) : T {
    this.logger.debug(`Creating ${chalk.cyan(this.classId)} with ID ${chalk.green(instanceId)} of type ${chalk.cyan(typeId)}`);
    var instance: T = this.createInstance(typeId, instanceId, opts);
    this.instances[instanceId] = instance;
    this.onAddInstance(instance, instanceId, typeId, opts);
    return instance;
  }
}
