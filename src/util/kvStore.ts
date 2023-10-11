import { KVStore } from "../runtime";

export const LocalStorageKvStore: KVStore = {
  async get(key) {
    return JSON.parse(localStorage.getItem(key) || "{}");
  },
  async set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};
