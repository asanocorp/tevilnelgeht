import {
  CharacterActionAnimation,
  CharacterActionAnimationManager,
  CharacterActionAnimationType
} from './character-action-animation-manager';

export enum CharacterActionType {
  Move = 'move'
}

export interface CharacterAction {
  type: CharacterActionType;
  [prop: string]: any;
}

export class CharacterActionManager {
  public constructor(private animationManager: CharacterActionAnimationManager) { }

  public dispatch(action: CharacterAction): void {
    switch (action.type) {
      case CharacterActionType.Move:
        this.resolveMoveAction(action);
        break;
      default:
        break;
    }
  }

  private resolveMoveAction(action: CharacterAction): void {
    const payload = action.payload;
    const attachment = payload.active;
    const from = payload.from;
    const to = payload.to;

    attachment.position.copy(to);
    this.animationManager.add({ type: CharacterActionAnimationType.Move, character: attachment.character, to, from });
  }
}
