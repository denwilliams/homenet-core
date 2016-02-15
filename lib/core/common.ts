/// <reference path="../../interfaces/interfaces.d.ts"/>

class CommonImpl implements ICommon {

  public logger: ILogger;
  public config: IConfig;
  public eventBus: IEventBus;
  public notifications: INotificationsManager;
  public storage: IStorageManager;

  constructor(logger: ILogger, config: IConfig, eventBus: IEventBus, notifications: INotificationsManager, storage: IStorageManager) {
    console.log('this', this);

    this.logger = logger;
    this.config = config;
    this.eventBus = eventBus;
    this.notifications = notifications;
    this.storage = storage;
  }

}

export = CommonImpl;
