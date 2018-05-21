export class PriorityQueue<T> {
  private backItem: T;

  private items: T[] = [];

  public constructor(items?: T[], private comparator?: (a: T, b: T) => boolean) {
    this.comparator = comparator || function comparator(a, b) { return a < b; };

    if (Array.isArray(items)) {
      if (items.length === 1) {
        this.backItem = items[0];
      }

      if (items.length > 1) {
        items.forEach((item) => this.backItem = this.getRearMostItem(item, this.backItem));
      }

      this.items = items.slice();

      if (this.items.length) {
        this.heapify(this.items);
      }
    }
  }

  public peekFront(): T {
    this.throwErrorIfInvalidPosition(0);
    return this.items[0];
  }

  public peekBack(): T {
    this.throwErrorIfInvalidPosition(0);
    return this.backItem;
  }

  public pop(): T {
    this.throwErrorIfInvalidPosition(0);

    const item = this.items[0];
    const size = this.items.length;

    if (size > 1) {
      const poppedItem = this.items.pop();

      if (poppedItem !== undefined) {
        this.items[0] = poppedItem;
      }

      this.percolateDown(0);
    } else {
      this.items.pop();
      this.backItem = undefined;
    }

    return item;
  }

  public push(item): PriorityQueue<T> {
    let ix = this.items.length;
    this.items.push(item);
    this.backItem = this.getRearMostItem(item, this.backItem);

    while (ix > 0) {
      // tslint:disable no-bitwise
      const position = (ix - 1) >> 1;
      const value = this.items[position];

      if (!this.comparator(item, value)) {
        break;
      }

      this.items[ix] = value;
      ix = position;
    }

    this.items[ix] = item;
    return this;
  }

  public clear(): PriorityQueue<T> {
    this.items = [];
    return this;
  }

  public size(): number {
    return this.items.length;
  }

  public empty() {
    return this.size() === 0;
  }

  private heapify(items: T[]): PriorityQueue<T> {
    const size = items.length;
    for (let i = (size >> 1); i >= 0; i--) {
      this.percolateDown(i);
    }
    return this;
  }

  private getRearMostItem(a, b): T {
    if (b === undefined) {
      return a;
    }
    if (this.comparator(a, b)) {
      return b;
    }
    return a;
  }

  private percolateDown(ix: number): PriorityQueue<T> {
    const size = this.items.length;
    const heapSize = size >>> 1;
    const value = this.items[ix];

    while (ix < heapSize) {
      let left = (ix << 1) + 1;
      const right = left + 1;
      let candidate = this.items[left];

      if (right < size) {
        if (this.comparator(this.items[right], candidate)) {
          left = right;
          candidate = this.items[right];
        }
      }

      if (!this.comparator(candidate, value)) {
        break;
      }

      this.items[ix] = candidate;
      ix = left;
    }

    this.items[ix] = value;
    return this;
  }

  private throwErrorIfInvalidPosition(position: number): void {
    if (!this.isValidPosition(position)) {
      throw new RangeError('Invalid position: ' + position.toString());
    }
  }

  private isValidPosition(position: number): boolean {
    return 0 <= position && position < this.items.length;
  }
}
