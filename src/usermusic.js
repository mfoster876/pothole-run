// IndexedDB-backed store for user-uploaded audio tracks.
// All data stays 100% local — blobs live in IDB, never sent anywhere.
// Degrades gracefully if IndexedDB is unavailable (resolves to empty/false).

const DB_NAME  = 'pothole-run-music';
const DB_VER   = 1;
const STORE    = 'tracks';

let _db = null;       // reused connection
let _counter = 0;     // monotone tiebreaker for id generation

// Open (or reuse) the DB connection.
function openDB() {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = e => { _db = e.target.result; resolve(_db); };
    req.onerror   = ()  => reject(req.error);
  });
}

// Wrap an IDB request in a promise.
function req2p(idbReq) {
  return new Promise((resolve, reject) => {
    idbReq.onsuccess = () => resolve(idbReq.result);
    idbReq.onerror   = () => reject(idbReq.error);
  });
}

/**
 * Store each File in the FileList as { id, name, blob }.
 * id is derived from name + counter + existing count to avoid Math.random deps.
 * Returns the updated track list [{ id, name }].
 */
export async function addTracks(fileList) {
  try {
    const db   = await openDB();
    const existing = await count();
    const files = Array.from(fileList || []);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const id   = `${file.name}_${++_counter}_${existing + i}`;
      const tx   = db.transaction(STORE, 'readwrite');
      await req2p(tx.objectStore(STORE).put({ id, name: file.name, blob: file }));
    }
    return listTracks();
  } catch {
    return [];
  }
}

/**
 * Resolve to [{ id, name }] — no blobs, safe for display.
 */
export async function listTracks() {
  try {
    const db  = await openDB();
    const tx  = db.transaction(STORE, 'readonly');
    const all = await req2p(tx.objectStore(STORE).getAll());
    return all.map(({ id, name }) => ({ id, name }));
  } catch {
    return [];
  }
}

/**
 * Resolve to [{ id, name, url }] where url = object URL pointing at the blob.
 * Caller is responsible for revoking URLs via revoke() when done.
 */
export async function getPlayableTracks() {
  try {
    const db  = await openDB();
    const tx  = db.transaction(STORE, 'readonly');
    const all = await req2p(tx.objectStore(STORE).getAll());
    return all.map(({ id, name, blob }) => ({
      id,
      name,
      url: URL.createObjectURL(blob),
    }));
  } catch {
    return [];
  }
}

/**
 * Revoke an array of object URLs to free memory.
 */
export function revoke(urls) {
  for (const url of urls || []) {
    try { URL.revokeObjectURL(url); } catch { /* ignore */ }
  }
}

/**
 * Wipe every track from the store.
 */
export async function clearTracks() {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE, 'readwrite');
    await req2p(tx.objectStore(STORE).clear());
    return true;
  } catch {
    return false;
  }
}

/**
 * Resolve to the number of stored tracks.
 */
export async function count() {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE, 'readonly');
    return req2p(tx.objectStore(STORE).count());
  } catch {
    return 0;
  }
}
