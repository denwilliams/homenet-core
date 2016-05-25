import {inject, injectable} from 'inversify';
// import {Homenet} from '../interfaces.d.ts';

@injectable()
export class Common implements Homenet.ICommon {

  public logger: Homenet.ILogger;
  public config: Homenet.IConfig;
  public eventBus: Homenet.IEventBus;
  public notifications: Homenet.INotificationsManager;
  public storage: Homenet.IStorageManager;

  constructor(
          @inject('ILogger') logger: Homenet.ILogger,
          @inject('IConfig') config: Homenet.IConfig,
          @inject('IEventBus') eventBus: Homenet.IEventBus,
          @inject('INotificationsManager') notifications: Homenet.INotificationsManager,
          @inject('IStorageManager') storage: Homenet.IStorageManager) {
    this.logger = logger;
    this.config = config;
    this.eventBus = eventBus;
    this.notifications = notifications;
    this.storage = storage;
  }

}
