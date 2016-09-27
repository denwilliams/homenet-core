import { injectable, inject } from 'inversify';
import { ClassTypeManager } from '../utils/class-type-manager';

const CLASS_ID = 'button';

@injectable()
export class ButtonManager extends ClassTypeManager<Homenet.IButton> implements Homenet.IButtonManager {
  private _eventBus: Homenet.IEventBus;

  constructor(
        @inject('IClassesManager') classes: Homenet.IClassesManager,
        @inject('IEventBus') eventBus: Homenet.IEventBus,
        @inject('IConfig') config: Homenet.IConfig,
        @inject('ILogger') logger: Homenet.ILogger) {
    super(CLASS_ID, logger);
    this._eventBus = eventBus;
    this.addToClasses(classes);
  }

  protected onAddInstance(instanceFn: Homenet.Func<Homenet.IButton>, instanceId: string, typeId: string, opts: any) : void {
    const button = instanceFn();
    const guid = `button.${instanceId}`;
    button.onClick(() => {
      this._eventBus.emit(guid, 'click', { timestamp: new Date() });
    });
    button.onDoubleClick(() => {
      this._eventBus.emit(guid, 'doubleclick', { timestamp: new Date() });
    });
    button.onHold(() => {
      this._eventBus.emit(guid, 'hold', { timestamp: new Date() });
    });
  }
}
