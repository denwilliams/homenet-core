import { injectable } from 'inversify';

@injectable()
export class SensorManager implements ISensorManager {
  getInstance(instanceId: string) : ISensor {
    return null;
  }
}
