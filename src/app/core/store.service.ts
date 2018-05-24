import { Injectable } from '@angular/core';

import * as Store from 'store/dist/store.modern';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  public get(key: string, optionalDefaultValue: any): any {
    return Store.get(key, optionalDefaultValue);
  }

  public set(key: string, value: any): any {
    return Store.set(key, value);
  }

  public remove(key: string): any {
    return Store.remove(key);
  }

  public each(callback): void {
    return Store.each(callback);
  }

  public clearAll(): void {
    return Store.clearAll();
  }
}
