import { openDB } from "idb";

export const db = openDB("colibri-db", 1, {
  upgrade(db) {
    db.createObjectStore("users", { keyPath: "id" });
  },
});
