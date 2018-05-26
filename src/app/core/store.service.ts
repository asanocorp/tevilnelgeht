import { Injectable } from '@angular/core';

import * as Store from 'store/dist/store.modern';

export interface StoreApi {
  get(key: string, optionalDefaultValue?: any): any;
  set(key: string, value: any): any;
  remove(key: string): any;
  each(callback: Function): void;
  clearAll(): void;
  hasNamespace(namespace: string): boolean;
  namespace(namespace: string): StoreApi;
}

@Injectable({
  providedIn: 'root'
})
export class StoreService implements StoreApi {
  public get(key: string, optionalDefaultValue?: any): any {
    return Store.get(key, optionalDefaultValue);
  }

  public set(key: string, value: any): any {
    return Store.set(key, value);
  }

  public remove(key: string): any {
    return Store.remove(key);
  }

  public each(callback: Function): void {
    return Store.each(callback);
  }

  public clearAll(): void {
    return Store.clearAll();
  }

  public hasNamespace(namespace: string): boolean {
    return Store.hasNamespace(namespace);
  }

  public namespace(namespace: string): StoreApi {
    return Store.namespace(namespace);
  }
}
