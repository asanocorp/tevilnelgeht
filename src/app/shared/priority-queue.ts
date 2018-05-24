/**
 * Priority queue.
 */
export class PriorityQueue<T> {
  /**
   * Item in queue with worst priority.
   */
  private backItem: T;

  /**
   * Queue items (heap).
   */
  private items: T[] = [];

  /**
   * Instantiate priority queue.
   *
   * @param items Initial queue items.
   * @param comparator Comparator function; return true if the first parameter has a better priority than the second parameter.
   */
  public constructor(items?: T[], private comparator = (a: T, b: T) => a < b) {
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

  /**
   * Peek at front (best priority) item.
   */
  public peekFront(): T {
    this.throwErrorIfInvalidPosition(0);
    return this.items[0];
  }

  /**
   * Peek at back (worst priority) item.
   */
  public peekBack(): T {
    this.throwErrorIfInvalidPosition(0);
    return this.backItem;
  }

  /**
   * Remove front (best priority) item from queue & return it.
   */
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

  /**
   * Add item to queue.
   *
   * @param item Item to be added to queue.
   */
  public push(item: T): PriorityQueue<T> {
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

  /**
   * Clear queue contents.
   */
  public clear(): PriorityQueue<T> {
    this.items.length = 0;
    return this;
  }

  /**
   * Get queue size.
   */
  public size(): number {
    return this.items.length;
  }

  /**
   * Test if queue is empty.
   */
  public empty() {
    return this.size() === 0;
  }

  /**
   * Heapify array contents.
   *
   * @param items Array to be heapified.
   */
  private heapify(items: T[]): PriorityQueue<T> {
    const size = items.length;
    for (let i = (size >> 1); i >= 0; i--) {
      this.percolateDown(i);
    }
    return this;
  }

  /**
   * Get the item with the worst priority.
   *
   * @param a First item.
   * @param b Second item.
   */
  private getRearMostItem(a: T, b: T): T {
    if (b === undefined) {
      return a;
    }
    if (this.comparator(a, b)) {
      return b;
    }
    return a;
  }

  /**
   * Percolate value at specified positon to its proper position (given its value).
   *
   * @param ix Heap position.
   */
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

  /**
   * Throw error if specified heap position is invalid.
   *
   * @param position Heap position.
   */
  private throwErrorIfInvalidPosition(position: number): void {
    if (!this.isValidPosition(position)) {
      throw new RangeError('Invalid position: ' + position.toString());
    }
  }

  /**
   * Test if specified heap posisiton is valid.
   *
   * @param position Heap position.
   */
  private isValidPosition(position: number): boolean {
    return 0 <= position && position < this.items.length;
  }
}
