import { Injectable } from '@angular/core';

import { TerrainService } from '../terrain/terrain.service';
import { Level } from './level';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  public constructor(private terrainService: TerrainService) { }

  public load(levelKey: string): Level {
    const level = new Level(levelKey, this.terrainService);
    return level;
  }
}
