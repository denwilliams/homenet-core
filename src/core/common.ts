import {inject, injectable} from 'inversify';

@injectable()
class CommonImpl implements ICommon {

  public logger: ILogger;
  public config: IConfig;
  public eventBus: IEventBus;
  public notifications: INotificationsManager;
  public storage: IStorageManager;

  constructor(
          @inject('ILogger') logger: ILogger,
          @inject('IConfig') config: IConfig,
          @inject('IEventBus') eventBus: IEventBus,
          @inject('INotificationsManager') notifications: INotificationsManager,
          @inject('IStorageManager') storage: IStorageManager) {
    this.logger = logger;
    this.config = config;
    this.eventBus = eventBus;
    this.notifications = notifications;
    this.storage = storage;
  }

}

export = CommonImpl;
