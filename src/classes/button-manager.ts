import { injectable, inject } from 'inversify';
import { ClassTypeManager } from '../utils/class-type-manager';

const CLASS_ID = 'button';

@injectable()
export class ButtonManager extends ClassTypeManager<Homenet.IButton> implements Homenet.IButtonManager {
  constructor(
        @inject('IClassesManager') classes: Homenet.IClassesManager,
        @inject('IEventBus') private eventBus: Homenet.IEventBus,
        @inject('ILogger') logger: Homenet.ILogger) {
    super(CLASS_ID, classes, logger);
  }

  protected onAddInstance(instance: Homenet.IButton, instanceId: string, typeId: string, opts: any) : void {
    const guid = `button.${instanceId}`;
    instance.onClick(() => {
      this.eventBus.emit(guid, 'click', { timestamp: new Date() });
    });
    instance.onDoubleClick(() => {
      this.eventBus.emit(guid, 'doubleclick', { timestamp: new Date() });
    });
    instance.onHold(() => {
      this.eventBus.emit(guid, 'hold', { timestamp: new Date() });
    });
  }
}
