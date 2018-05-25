import { CharacterAction, CharacterActionManager, CharacterActionType } from './character-action-manager';
import { CharacterData } from './character-manager';

export class CharacterMoveActionManager {
  private actions: CharacterAction[] = [];

  public constructor (private actionManager: CharacterActionManager) { }

  public add(active: CharacterData, path: Phaser.Math.Vector2[]): void {
    for (let i = 0, len = path.length; i < len - 1; ++i) {
      const from = path[i].clone();
      const to = path[i + 1].clone();
      this.actions.push({ type: CharacterActionType.Move, payload: { active, from, to } });
    }
  }

  public processNext(test: (position: Phaser.Math.Vector2) => boolean): boolean {
    const action = this.actions.shift();
    const result = test(action.payload.to);

    if (result) {
      this.actionManager.dispatch(action);
    }

    return result;
  }

  public clear(): void {
    this.actions.length = 0;
  }

  public getPendingPath(): Phaser.Math.Vector2[] {
    const path = this.actions.map(action => action.payload.from);
    path.push(this.actions[this.actions.length - 1].payload.to);
    return path;
  }

  public hasPending(): boolean {
    return !!this.actions.length;
  }
}
