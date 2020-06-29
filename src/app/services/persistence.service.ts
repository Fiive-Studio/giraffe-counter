import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {

  // Keys
  PLAYER_COUNT: string = 'player-count';
  PLAYER_LIST: string = 'player-list';
  RESULTS_LIST: string = 'result-list';

  constructor() { }

  async getValue(key: string) {
    const ret = await Storage.get({ key: key });
    return ret.value;
  }

  async saveValue(key: string, value: any) {
    await Storage.set({
      key: key,
      value: value
    });
  }

  async getObject(key: string) {
    const ret = await Storage.get({ key: key });
    if (ret.value == null) { return null }
    return JSON.parse(ret.value);
  }

  async saveObject(key: string, obj: any) {
    await Storage.set({
      key: key,
      value: JSON.stringify(obj)
    });
  }

  async removeItem(key: string) {
    await Storage.remove({ key: key });
  }

  async clear() {
    await Storage.clear();
  }
}
