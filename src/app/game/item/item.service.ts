import { Injectable } from '@angular/core';

import { equippable } from './equippable';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private itemIndex = { equippable };

  public getEquippableItemGroup(group: string): any {
    return this.itemIndex.equippable[group];
  }
}
