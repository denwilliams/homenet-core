export class Instance {
  public class: string;
  public key: string;
  constructor(
        public id: string,
        classId: string,
        public type: string,
        public instance: any,
        public zone: string
      ) {
    this.class = classId;
    this.key = `${classId}.${id}`;
  }

  get expose() {
    return this.instance.expose;
  }

  get name() {
    return this.instance.name;
  }

  get switchId() {
    return this.instance.switchId;
  }

  get valueId() {
    return this.instance.valueId;
  }

  get commandId() {
    return this.instance.commandId;
  }

  get commandMeta() {
    return this.instance.commandMeta;
  }
}
