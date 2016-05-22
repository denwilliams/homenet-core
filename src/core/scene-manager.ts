import { injectable, inject } from "inversify";

@injectable()
export class SceneManager implements ISceneManager {
  private _scene : any;

  constructor(@inject('INodeRed') nodeRed: INodeRed) {
    this._scene = nodeRed.getSceneManager();
  }

  private _getScene(id: string) : IScene {
    if (!id) return null;
    return {id, name: id};
  }

  get current() : IScene {
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
