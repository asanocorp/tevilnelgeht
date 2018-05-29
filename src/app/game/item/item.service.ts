import { Injectable } from '@angular/core';

import { ItemConfig } from './item-config';
import { ItemDefinitions } from './item-definitions';
import { items } from './items';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  public static readonly ItemEquipSlot = ItemDefinitions.ItemEquipSlot;

  public static readonly ItemType = ItemDefinitions.ItemType;

  public get(type: string, id: string): ItemConfig {
    return items[type][id];
  }
}
