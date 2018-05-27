import { Injectable } from '@angular/core';

import { ClassConfig } from './class-config';
import { ClassDefinitions } from './class-definitions';
import { classes } from './classes';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  public static readonly ClassId = ClassDefinitions.ClassId;

  public constructor() { }

  public get(classId: string): ClassConfig {
    return classes[classId];
  }

  public getPlayable(): ClassConfig[] {
    return ClassDefinitions.playableClassIds.map(id => this.get(id));
  }
}
