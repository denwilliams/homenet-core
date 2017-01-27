import { injectable, inject } from 'inversify';
import { ClassTypeManager } from '../utils/class-type-manager';

const CLASS_ID = 'button';

@injectable()
export class ButtonManager extends ClassTypeManager<Homenet.IButton> implements Homenet.IButtonManager {
  private _eventBus: Homenet.IEventBus;

  constructor(
        @inject('IClassesManager') classes: Homenet.IClassesManager,
        @inject('IEventBus') private eventBus: Homenet.IEventBus,
        @inject('ILogger') private logger: Homenet.ILogger) {
    super(CLASS_ID, logger);
    this.addToClasses(classes);
  }

  protected onAddInstance(instance: Homenet.IButton, instanceId: string, typeId: string, opts: any) : void {
    const guid = `button.${instanceId}`;
    instance.onClick(() => {
      this._eventBus.emit(guid, 'click', { timestamp: new Date() });
    });
    instance.onDoubleClick(() => {
      this._eventBus.emit(guid, 'doubleclick', { timestamp: new Date() });
    });
    instance.onHold(() => {
      this._eventBus.emit(guid, 'hold', { timestamp: new Date() });
    });
  }
}
