import { Injectable } from '@angular/core';

import { TextureService } from '../texture/texture.service';
import { ItemConfig } from './item-config';
import { ItemDefinitions } from './item-definitions';
import { items } from './items';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  public readonly pixelWidth = ItemDefinitions.pixelWidth;

  public readonly pixelHeight = ItemDefinitions.pixelHeight;

  public readonly ItemEquipSlot = ItemDefinitions.ItemEquipSlot;

  public readonly ItemType = ItemDefinitions.ItemType;

  public constructor(private textureService: TextureService) { }

  public get(itemId: string): ItemConfig {
    return items[itemId];
  }

  public loadBaseRenderables(scene: Phaser.Scene): void {
    Object.keys(items).forEach(itemKey => {
      const item = this.get(itemKey);
      this.textureService.loadTextures(scene, [{ ...item.texture, shadowColor: 'black' }], this.pixelWidth, this.pixelHeight);
    });
  }
}
