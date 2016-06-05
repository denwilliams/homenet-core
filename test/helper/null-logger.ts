/// <reference path="../../interfaces/interfaces.d.ts"/>

class NullLogger implements ILogger {

  constructor() {}

  info() {}
  warn() {}
  error() {}
  debug() {}
}

export = NullLogger;
