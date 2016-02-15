declare module 'node-red' {
  import * as NodeRED from 'node-red-interfaces';

  var RED: NodeRED.IRuntime;
  export = RED;
}
