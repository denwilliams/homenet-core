import { injectable, inject } from 'inversify';
import { ClassTypeManager } from '../utils/class-type-manager';

const CLASS_ID = 'button';

@injectable()
export class ButtonManager extends ClassTypeManager<Homenet.IButton> implements Homenet.IButtonManager {
  constructor(
        @inject('IClassesManager') classes: Homenet.IClassesManager,
        @inject('IConfig') config: Homenet.IConfig,
        @inject('ILogger') logger: Homenet.ILogger) {
    super(CLASS_ID, logger);
    this.addToClasses(classes);
  }

  protected onAddInstance(instanceFn: Homenet.Func<Homenet.IButton>, instanceId: string, typeId: string, opts: any) : void {
    const button = instanceFn();
    const guid = `button.${instanceId}`;
  }
}
