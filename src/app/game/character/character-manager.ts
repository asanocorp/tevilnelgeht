import { Character } from './character';

export interface CharacterData {
  sprite: Character;
  position: Phaser.Math.Vector2;
  isPlayer?: boolean;
}

export class CharacterManager {
  private pendingCharacterAttachments: CharacterData[] = [];

  private pendingCharacterDetachments: CharacterData[] = [];

  private nonPlayerCharacterAttachments: CharacterData[] = [];

  private playerCharacterAttachment: CharacterData;

  public attachPlayerCharacter(player: Character): void {
    this.pendingCharacterAttachments.push({ sprite: player, position: new Phaser.Math.Vector2(4, 4), isPlayer: true });
  }

  public detachPlayerCharacter(): Character {
    this.pendingCharacterDetachments.push(this.playerCharacterAttachment);
    return this.playerCharacterAttachment.sprite;
  }

  public attachNonPlayerCharacter(character: Character, position: Phaser.Math.Vector2): void {
    this.pendingCharacterAttachments.push({ sprite: character, position });
  }

  public detachNonPlayerCharacter(character: Character): void {
    const characterAttachment = this.nonPlayerCharacterAttachments.find(attachment => character === attachment.sprite);
    this.pendingCharacterDetachments.push(characterAttachment);
  }

  public getPlayerCharacterPosition(): Phaser.Math.Vector2 {
    return this.playerCharacterAttachment.position.clone();
  }

  public getPlayerCharacterData(): CharacterData {
    return this.playerCharacterAttachment;
  }

  public getNonPlayerCharacterPositions(): Phaser.Math.Vector2[] {
    return this.nonPlayerCharacterAttachments.map(attachment => attachment.position.clone());
  }

  public update(onAttach: (attachment: CharacterData) => void, onDetach: (attachment: CharacterData) => void): void {
    this.processPendingCharacterAttachments(onAttach);
    this.processPendingCharacterDetachments(onDetach);
  }

  private processPendingCharacterAttachments(onAttach: (attachment: CharacterData) => void): void {
    this.pendingCharacterAttachments.forEach(attachment => {
      if (attachment.isPlayer) {
        this.playerCharacterAttachment = attachment;
      } else {
        this.nonPlayerCharacterAttachments.push(attachment);
      }

      onAttach(attachment);
    });

    this.pendingCharacterAttachments.length = 0;
  }

  private processPendingCharacterDetachments(onDetach: (attachment: CharacterData) => void): void {
    this.pendingCharacterDetachments.forEach(attachment => {
      if (attachment.isPlayer) {
        this.playerCharacterAttachment = undefined;
      } else {
        const index = this.nonPlayerCharacterAttachments.indexOf(attachment);
        this.nonPlayerCharacterAttachments.splice(index, 1);
      }

      onDetach(attachment);
    });

    this.pendingCharacterDetachments.length = 0;
  }
}
