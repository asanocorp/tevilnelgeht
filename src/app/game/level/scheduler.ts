import { PriorityQueue } from '../../shared/priority-queue';

export class Scheduler {
  private queue = new PriorityQueue([], Scheduler.cmp);

  private pendingRemovals = [];

  private time = 0;

  private locks = 1;

  private static cmp(a, b) {
    return a.time < b.time;
  }

  public constructor() {
    this.reset();
  }

  public add(actor, delay?, actMethodName?): void {
    this.queue.push({
      actor,
      time: this.time + (delay || 1),
      act: actMethodName || 'act'
    });
  }

  public remove(actor): void {
    this.pendingRemovals.push(actor);
  }

  public start(): void {
    this.unlock();
  }

  public lock(): void {
    ++this.locks;
  }

  public unlock(): void {
    if (!this.locks) {
      throw new Error('error: negative locks requested');
    }
    --this.locks;
    this.run();
  }

  private run(): void {
    while (!this.locks) {
      if (this.queue.empty()) {
        this.reset();
        return;
      }

      const action = this.queue.pop();
      this.time += (action.time - this.time);

      const q = this.queue;
      const t = this.time;
      const actor = action.actor;

      const index = this.pendingRemovals.indexOf(actor);

      if (index !== -1) {
        this.pendingRemovals.splice(index, 1);
        continue;
      }

      const result = actor[action.act](function (c) {
        q.push({ actor, time: t + (c || 1), act: action.act });
      });

      if (result instanceof Promise) {
        this.lock();
        result.then(this.unlock.bind(this));
      }
    }
  }

  private reset() {
    this.time = 0;
    this.locks = 1;
  }
}
