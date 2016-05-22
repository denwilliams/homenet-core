/// <reference path="src/interfaces.d.ts"/>

declare module 'homenet-core' {
  export function plugin(): (typeConstructor: any) => void;
  export function service(serviceIdentifier: (string)): (target: any, targetKey: string, index?: number) => any;
  export function init(RED: any): IRuntime;
}
