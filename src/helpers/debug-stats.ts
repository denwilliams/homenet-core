import { injectable } from 'inversify';

@injectable()
export class DebugStats implements Homenet.IStatsTarget {
  private _session: any[] = [];

  gauge(id: string, value: number) : void {
    this._session.push({type: 'gauge', id, value});
  }

  counter(id: string, increment?: number) : void {
    this._session.push({type: 'counter', id, increment});
  }
}
