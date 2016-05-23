import { injectable, inject } from "inversify";
// import {Homenet} from '../interfaces.d.ts';

@injectable()
export class SceneManager implements Homenet.ISceneManager {
  private _scene : any;

  constructor(@inject('INodeRed') nodeRed: Homenet.INodeRed) {
    this._scene = nodeRed.getSceneManager();
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
