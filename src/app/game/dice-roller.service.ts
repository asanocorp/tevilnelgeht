import { Injectable } from '@angular/core';

export enum DiceRollerMode { Range, Discrete }

export interface Dice {
  number: number;
  die: number;
  modifier?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DiceRollerService {
  private rnd = new Phaser.Math.RandomDataGenerator();

  private mode = DiceRollerMode.Range;

  public sow(seeds: string[]): void {
    this.rnd.sow(seeds);
  }

  public getMode(): DiceRollerMode {
    return this.mode;
  }

  public setMode(mode: DiceRollerMode): void {
    this.mode = mode;
  }

  public roll(n: number | string | Dice, d?: number, m = 0): number {
    switch (typeof n) {
      case 'number':
        return this.rollWithArgs(n as number, d, m);
      case 'string':
        return this.rollWithString(n as string);
      case 'object':
        return this.rollWithObject(n as Dice);
    }
  }

  public rollWithString(s: string): number {
    const [n, d, m] = s.match(/(\d+)[dD](\d+)(\+\d+|-\d+)?/).slice(1, 4).map(c => c !== undefined ? Number.parseInt(c) : 0);
    return this.rollWithArgs(n, d, m);
  }

  public rollWithObject(o: Dice) {
    const { number, die, modifier } = o;
    return this.rollWithArgs(number, die, modifier);
  }

  public rollWithArgs(n: number, d: number, m = 0): number {
    if (this.mode === DiceRollerMode.Range) {
      console.log(n);
      console.log(d);
      console.log(m);
      return this.rnd.integerInRange(n, n * d) + m;
    }

    let t = 0;
    for (let i = 0; i < n; ++i) {
      t += this.rnd.integerInRange(1, d);
    }

    return t + m;
  }
}
