/// <reference path="../switch/models.ts" />

interface Light extends Switch {
  turnOn() : void
  turnOff() : void
}

class HueLight implements Light {
  get() : any {
    console.log('test');
  }
  set(val: any) {
    console.log('test');
  }
  turnOn() {
    this.set(true);
  }
  turnOff() {
    this.set(false);
  }
}

