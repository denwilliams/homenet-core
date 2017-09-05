import chalk = require('chalk');
import { injectable, inject } from 'inversify';

import { ClassTypeManager } from './class-type-manager';

@injectable()
export abstract class SettableClassTypeManager<T> extends ClassTypeManager<T> {
  addSettableType(typeId: string, factory: Homenet.IClassTypeFactory<Homenet.ISettable>) {
    this.logger.info(`Adding ${chalk.blue(this.classId)}  type ${chalk.cyan(typeId)}`);
    this.types[typeId] = (id : string, opts : any) : T => {
      const settable: Homenet.ISettable = factory(id, opts);
      return this.mapSettable(id, settable, opts);
    };
  }

  protected abstract mapSettable(id: string, settable: Homenet.ISettable, opts : any): T;
}
