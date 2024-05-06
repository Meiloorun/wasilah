import { KeyHelper, PreKeyType, SignedPublicPreKeyType } from '@privacyresearch/libsignal-protocol-typescript';
import { SignalProtocolStore } from '../signal/signal-store';

export async function createIdentity() {
  try {
    // const dbrequest = window.indexedDB.open('SignalDB', 1);
    // dbrequest.onerror = (event) => {
    //   console.error("Can't connect to DB");
    // };
    // dbrequest.onupgradeneeded = function(event) {
    //   const db = event.target.result;
    //   const objectStore = db.createObjectStore('identityKeys', { autoIncrement: true });
    // };

    const signalStore = new SignalProtocolStore();
    const registrationId = KeyHelper.generateRegistrationId();
    
    signalStore.put('registrationId', registrationId);

    const identityKeyPair = await KeyHelper.generateIdentityKeyPair();
    localStorage.setItem('identityKey', identityKeyPair);
    signalStore.put('identityKey', identityKeyPair);
    console.log('Generated Key', { identityKeyPair })

    const baseKeyId = Math.floor(10000 * Math.random());
    const preKey = await KeyHelper.generatePreKey(baseKeyId);
    signalStore.storePreKey(`${baseKeyId}`, preKey.keyPair);
    console.log('PreKey: ', { preKey });

    const signedPreKeyId = Math.floor(10000 * Math.random());
    const signedPreKey = await KeyHelper.generateSignedPreKey(identityKeyPair, signedPreKeyId);
    signalStore.storeSignedPreKey(signedPreKeyId, signedPreKey.keyPair);
    const publicSignedPreKey: SignedPublicPreKeyType = {
      keyId: signedPreKeyId,
      publicKey: signedPreKey.keyPair.pubKey,
      signature: signedPreKey.signature,
    }

    const publicPreKey: PreKeyType = {
      keyId: preKey.keyId,
      publicKey: preKey.keyPair.pubKey,
    };
    
    const identityPubKey = identityKeyPair.pubKey;

    const oneTimePreKey = [publicPreKey]

    // dbrequest.onsuccess = function(event) {
    //   const db = event.target.result;
    //   if (!db.objectStoreNames.contains('identityKeys')) {
    //     const objectStore = db.createObjectStore('identityKeys', { autoIncrement: true });
    //   }
    //   const transaction = db.transaction(['identityKeys'], 'readwrite');
    //   const objectStore = transaction.objectStore('identityKeys');
    //   const request = objectStore.put(identityKeyPair)
    //   request.onsuccess = (event) => {
    //     console.log("added identityKeyPair to indexDB")
    //   }
    // };

    return {publicSignedPreKey, oneTimePreKey, identityPubKey, registrationId}

  } catch (error) {
    console.error(error);
  }
  };