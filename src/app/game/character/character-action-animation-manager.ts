import { Character } from './character';

export enum CharacterActionAnimationType {
  Move = 'move'
}

export interface CharacterActionAnimation {
  type: CharacterActionAnimationType;
  sprite: Character;
  [prop: string]: any;
}

export class CharacterActionAnimationManager {
  private animationQueue: CharacterActionAnimation[] = [];

  private totalAnimations = 0;

  private completedAnimations = 0;

  private totalCurrentBatchAnimations = 0;

  private completedCurrentBatchAnimations = 0;

  private animationBatches: CharacterActionAnimation[][];

  private onComplete: () => void;

  public constructor(private tilemap: Phaser.Tilemaps.Tilemap) { }

  public add(animation: CharacterActionAnimation): void {
    this.animationQueue.push(animation);
  }

  public run(onComplete: () => void): void {
    if (this.animationQueue.length) {
      this.onComplete = onComplete;
      // Process queue & do some async shit...

      this.totalAnimations = this.animationQueue.length;
      this.completedAnimations = 0;

      this.batchAnimations();
      this.runNextBatch();
    } else {
      onComplete();
    }
  }

  private batchAnimations(): void {
    this.animationBatches = [];

    let move = [];
    this.animationQueue.forEach(animation => {
      if (animation.type === CharacterActionAnimationType.Move) {
        move.push(animation);
      } else {
        this.animationBatches.push(move);
        this.animationBatches.push([animation]);
        move = [];
      }
    });

    if (move.length) {
      this.animationBatches.push(move);
    }
  }

  private runNextBatch(): void {
    const batch = this.animationBatches.shift();

    this.totalCurrentBatchAnimations = batch.length;
    this.completedCurrentBatchAnimations = 0;

    batch.forEach(animation => this.runAnimation(animation));
  }

  private runAnimation(animation: CharacterActionAnimation): void {
    switch (animation.type) {
      case CharacterActionAnimationType.Move:
        this.runMoveAnimation(animation);
        break;
      default:
        break;
    }
  }

  private onBatchRunComplete(): void {
    if (this.completedAnimations >= this.totalAnimations) {
      this.animationQueue.length = 0;
      this.onComplete();
      this.onComplete = undefined;
    } else {
      this.runNextBatch();
    }
  }

  private runMoveAnimation(animation: CharacterActionAnimation): void {
    const character = animation.sprite;
    const from = animation.from;
    const to = animation.to;
    const magnitude = to.subtract(from);
    const duration = 1000;

    const path = new Phaser.Curves.Path();
    const dst = new Phaser.Math.Vector2(magnitude.x, magnitude.y);

    dst.multiply(new Phaser.Math.Vector2(this.tilemap.tileWidth, this.tilemap.tileHeight));
    path.add(new (Phaser.Curves as any).Line([0, 0, dst.x, dst.y]));

    character.setPath(path);
    character.startFollow(animation.duration);
    character.pathTween.setCallback('onStart', () => character.play(magnitude.x >= 0 ? 'walkRight' : 'walkLeft'), []);
    character.pathTween.setCallback('onComplete', () => {
      character.play('idle');

      if (++this.completedCurrentBatchAnimations >= this.totalCurrentBatchAnimations) {
        this.completedAnimations += this.completedCurrentBatchAnimations;
        this.onBatchRunComplete();
      }
    }, []);
  }
}
