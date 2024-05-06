// signal-store.js
/* eslint-disable @typescript-eslint/no-explicit-any */
const {
    StorageType,
    Direction,
    SessionRecordType,
    SignalProtocolAddress,
    PreKeyPairType,
    SignedPreKeyPairType,
} = require('@privacyresearch/libsignal-protocol-typescript');

// Type guards
function isKeyPairType(kp) {
    return !!(kp?.privKey && kp?.pubKey);
}

function isPreKeyType(pk) {
    return typeof pk?.keyId === 'number' && isKeyPairType(pk?.keyPair);
}

function isSignedPreKeyType(spk) {
    return spk?.signature && isPreKeyType(spk);
}

function isArrayBuffer(thing) {
    const t = typeof thing;
    return !!thing && t !== 'string' && t !== 'number' && 'byteLength' in thing;
}

class SignalProtocolStore {
    constructor() {
        this.db = null;
        const dbrequest = window.indexedDB.open('SignalDB', 1);
        dbrequest.onerror = (event) => {
            console.error("Can't connect to DB");
        };

        dbrequest.onsuccess = (event) => {
            this.db = event.target.result;
        };

        dbrequest.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore('signalStore', { autoIncrement: true });
        };
    }

    async get(key, defaultValue) {
        if (key === null || key === undefined) throw new Error('Tried to get value for undefined/null key');
        await this.ensureDB();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['signalStore'], 'readonly');
            const objectStore = transaction.objectStore('signalStore');
            const request = objectStore.get(key);

            request.onerror = (event) => {
                console.error("Error getting value from IndexedDB");
                reject("Error getting value from IndexedDB");
            };

            request.onsuccess = (event) => {
                resolve(request.result || defaultValue);
            };
        });
    }

    async remove(key) {
        if (key === null || key === undefined) throw new Error('Tried to remove value for undefined/null key');
        await this.ensureDB();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['signalStore'], 'readwrite');
            const objectStore = transaction.objectStore('signalStore');
            const request = objectStore.delete(key);

            request.onerror = (event) => {
                console.error("Error removing value from IndexedDB");
                reject("Error removing value from IndexedDB");
            };

            request.onsuccess = (event) => {
                resolve();
            };
        });
    }

    async put(key, value) {
        if (key === undefined || value === undefined || key === null || value === null)
            throw new Error('Tried to store undefined/null');
        await this.ensureDB();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['signalStore'], 'readwrite');
            const objectStore = transaction.objectStore('signalStore');
            const request = objectStore.put(value, key);

            request.onerror = (event) => {
                console.error("Error storing value in IndexedDB");
                reject("Error storing value in IndexedDB");
            };

            request.onsuccess = (event) => {
                resolve();
            };
        });
    }

    async ensureDB() {
        if (!this.db) {
            await new Promise((resolve, reject) => {
                const dbrequest = window.indexedDB.open('SignalDB', 1);
                dbrequest.onerror = (event) => {
                    console.error("Can't connect to DB");
                    reject();
                };

                dbrequest.onsuccess = (event) => {
                    this.db = event.target.result;
                    resolve();
                };

                dbrequest.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    db.createObjectStore('signalStore', { autoIncrement: true });
                };
            });
        }
    }

    async getIdentityKeyPair() {
        // return new Promise((resolve, reject) => {
        //     const dbrequest = window.indexedDB.open('SignalDB', 1);
        //     dbrequest.onerror = (event) => {
        //         console.error("Can't connect to DB");
        //         reject("Can't connect to DB");
        //     };
    
        //     dbrequest.onsuccess = (event) => {
        //         const db = event.target.result;
        //         const transaction = db.transaction(['identityKeys'], 'readwrite');
        //         const objectStore = transaction.objectStore('identityKeys');
        //         const request = objectStore.get(1)
    
        //         request.onerror = (event) => {
        //             console.error("Can't Find IdentityKey in IndexDB");
        //             reject("Can't Find IdentityKey in IndexDB");
        //         }
    
        //         request.onsuccess = (event) => {
        //             const kp = event.target.result;
        //             if (isKeyPairType(kp) || typeof kp === "undefined") {
        //                 resolve(kp);
        //             } else {
        //                 reject(new Error('Item stored as identity key of unknown type.'));
        //             }
        //         }
        //     }
        // });

        const kp = await this.get('identityKey', undefined)
        console.log(kp)
        if (isKeyPairType(kp) || typeof kp === 'undefined') {
            return kp;
        }
        throw new Error('Item stored as identity key of unknown type');
    }
    

    async getLocalRegistrationId() {
        const rid = await this.get('registrationId', undefined);
        if (typeof rid === 'number' || typeof rid === 'undefined') {
            return rid;
        }
        throw new Error('Stored Registration ID is not a number');
    }

    async isTrustedIdentity(identifier, identityKey, _direction) {
        if (identifier === null || identifier === undefined) {
            throw new Error('tried to check identity key for undefined/null key');
        }
        const trusted = await this.get('identityKey' + identifier, undefined);

        // TODO: Is this right? If the ID is NOT in our store we trust it?
        if (trusted === undefined) {
            return Promise.resolve(true);
        }
        return Promise.resolve(arrayBufferToString(identityKey) === arrayBufferToString(trusted));
    }

    async loadPreKey(keyId) {
        let res = await this.get('25519KeypreKey' + keyId, undefined);
        if (isKeyPairType(res)) {
            res = { pubKey: res.pubKey, privKey: res.privKey };
            return res;
        } else if (typeof res === 'undefined') {
            return res;
        }
        throw new Error(`stored key has wrong type`);
    }

    async loadSession(identifier) {
        const rec = await this.get('session' + identifier, undefined);
        if (typeof rec === 'string') {
            return rec;
        } else if (typeof rec === 'undefined') {
            return rec;
        }
        throw new Error(`session record is not an ArrayBuffer`);
    }

    async loadSignedPreKey(keyId) {
        const res = await this.get('25519KeysignedKey' + keyId, undefined);
        if (isKeyPairType(res)) {
            return { pubKey: res.pubKey, privKey: res.privKey };
        } else if (typeof res === 'undefined') {
            return res;
        }
        throw new Error(`stored key has wrong type`);
    }

    async removePreKey(keyId) {
        this.remove('25519KeypreKey' + keyId);
    }

    async saveIdentity(identifier, identityKey) {
        if (identifier === null || identifier === undefined)
            throw new Error('Tried to put identity key for undefined/null key');

        const address = SignalProtocolAddress.fromString(identifier);

        const existing = await this.get('identityKey' + address.getName(), undefined);
        this.put('identityKey' + address.getName(), identityKey);
        if (existing && !isArrayBuffer(existing)) {
            throw new Error('Identity Key is incorrect type');
        }

        if (existing && arrayBufferToString(identityKey) !== arrayBufferToString(existing)) {
            return true;
        } else {
            return false;
        }
    }

    async storeSession(identifier, record) {
        return this.put('session' + identifier, record);
    }

    async loadIdentityKey(identifier) {
        if (identifier === null || identifier === undefined) {
            throw new Error('Tried to get identity key for undefined/null key');
        }

        const key = await this.get('identityKey' + identifier, undefined);
        if (isArrayBuffer(key)) {
            return key;
        } else if (typeof key === 'undefined') {
            return key;
        }
        throw new Error(`Identity key has wrong type`);
    }

    async storePreKey(keyId, keyPair) {
        return this.put('25519KeypreKey' + keyId, keyPair);
    }

    async storeSignedPreKey(keyId, keyPair) {
        return this.put('25519KeysignedKey' + keyId, keyPair);
    }

    async removeSignedPreKey(keyId) {
        return this.remove('25519KeysignedKey' + keyId);
    }

    async removeSession(identifier) {
        return this.remove('session' + identifier);
    }

    async removeAllSessions(identifier) {
        for (const id in this._store) {
            if (id.startsWith('session' + identifier)) {
                delete this._store[id];
            }
        }
    }
}

function arrayBufferToString(b) {
    return uint8ArrayToString(new Uint8Array(b));
}

function uint8ArrayToString(arr) {
    const end = arr.length;
    let begin = 0;
    if (begin === end) return '';
    let chars = [];
    const parts = [];
    while (begin < end) {
        chars.push(arr[begin++]);
        if (chars.length >= 1024) {
            parts.push(String.fromCharCode(...chars));
            chars = [];
        }
    }
    return parts.join('') + String.fromCharCode(...chars);
}

module.exports = {
    SignalProtocolStore,
    arrayBufferToString,
    uint8ArrayToString,
    isKeyPairType,
    isPreKeyType,
    isSignedPreKeyType,
    isArrayBuffer,
};
