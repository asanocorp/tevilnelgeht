import { Injectable } from '@angular/core';

import { equippable } from './equippable';

import { ItemDefinitions } from './item-definitions';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  public static readonly ItemEquipSlot = ItemDefinitions.ItemEquipSlot;

  private itemIndex = { equippable };

  public getEquippableItemGroup(group: string): any {
    if (group === 'leftFinger' || group === 'rightFinger') {
      group = 'fingers';
    }

    return this.itemIndex.equippable[group];
  }
}
