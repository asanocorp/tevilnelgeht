import { Injectable } from '@angular/core';

import { fighter } from './fighter';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private classIndex = { fighter };

  public constructor() { }

  public get(classId: string): any {
    return this.classIndex[classId];
  }
}
