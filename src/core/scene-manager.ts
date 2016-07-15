import { injectable, inject } from "inversify";
// import {Homenet} from '../interfaces.d.ts';

@injectable()
export class SceneManager implements Homenet.ISceneManager {
  private _scene : any;
  private _persistence: Homenet.IPersistence;

  constructor(
            @inject('INodeRed') nodeRed: Homenet.INodeRed,
            @inject('IPersistence') persistence: Homenet.IPersistence,
            @inject('IStateManager') states: Homenet.IStateManager
            ) {
    this._scene = nodeRed.getSceneManager();
    this._persistence = persistence;
    this._init();
    this.onChanged(scene => {
      this._persistence.set('scene', scene);
    });
    const self = this;
    const stateProvider: Homenet.IStateProvider = {
      getCurrent() : Promise<string> {
        return Promise.resolve(self.getCurrentId());
      },
      setCurrent(state: string) : Promise<string> {
        self.set(state);
        return Promise.resolve(self.getCurrentId());
      },
      getAvailable(): string[] {
        return null;
      }
    };
    states.addType('scene', stateProvider);
  }

  private _init() {
    return this._persistence.get('scene')
    .then(value => { this.set(value); });
  }

  private _getScene(id: string) : Homenet.IScene {
    if (!id) return null;
    return {id, name: id};
  }

  get current() : Homenet.IScene {
    return this._getScene(this.getCurrentId());
  }

  set(name: string) : void {
    this._scene.set(name);
  }

  onChanged(callback : Function) : void {
    this._scene.onChanged(callback);
  }

  getCurrentId() : string {
    return this._scene.getCurrentId();
  }
}
