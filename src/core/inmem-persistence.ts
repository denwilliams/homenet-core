import { injectable, inject } from "inversify";
import * as Q from 'q';

@injectable()
export class InMemPersistence implements Homenet.IPersistence {
  private _vals = {};

  get(key: string) : Promise<any> {
    return Promise.resolve(this._vals[key] || null);
  }

  set(key: string, value: any) : Promise<any> {
    this._vals[key] = value;
    return Promise.resolve(value);
  }
}
