/// <reference path="../interfaces.d.ts"/>

import { injectable } from 'inversify';
// import {Homenet} from '../interfaces.d.ts';

@injectable()
export class SensorManager implements Homenet.ISensorManager {
  getInstance(instanceId: string) : Homenet.ISensor {
    return null;
  }
}
