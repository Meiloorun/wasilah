import { SessionCipher, SignalProtocolAddress } from "@privacyresearch/libsignal-protocol-typescript"
import { SignalProtocolStore } from "../signal/signal-store"
import { BehaviorSubject } from "rxjs";

const sessionListSubject = new BehaviorSubject([]);
const currentSessionSubject = new BehaviorSubject(null);

export async function sessionForRemoteUser(username){
    return sessionListSubject.value.find((session) => session.remoteUsername === username)
}

export function addMessageToSession(address, cm) {
    const userSession = { ...sessionForRemoteUser(address) }

    userSession.messages.push(cm)
    const sessionList = sessionListSubject.value.filter((session) => session.remoteUsername !== address)
    console.log('Filtered session list', { sessionList })

    sessionList.unshift(userSession)
    sessionListSubject.next(sessionList)
    if (currentSessionSubject.value?.remoteUsername === address) {
        currentSessionSubject.next(userSession)
    }  
}

export async function processPreKeyMessage(address, message) {
    const cipher  = new SessionCipher(SignalProtocolStore, new SignalProtocolAddress(address, 1))
    const plaintextBytes = await cipher.decryptPreKeyWhisperMessage(message.body, 'binary')

    const session = sessionForRemoteUser(address) || {
        remoteUsername: address,
        messages: [],
    }

    const sessionList = [...sessionListSubject.value]
    sessionList.unshift(session)
    sessionListSubject.next(sessionList)


    let cm = null
    try{
        const plaintext = new TextDecoder().decode(new Uint8Array(plaintextBytes))
        cm = JSON.parse(plaintext)

        addMessageToSession(address, cm)
    } catch (e) {
        console.log('PreKey message does not contain JSON')
    }
}

export async function processRegularMessage(address, message) {
    console.log('processRegularMessage');
    const cipher = new SessionCipher(SignalProtocolStore, new SignalProtocolAddress(address, 1));
    const plaintextBytes = await cipher.decryptWhisperMessage(message.body, 'binary');
    const plaintext = new TextDecoder().decode(new Uint8Array(plaintextBytes));

    const cm = JSON.parse(plaintext);
    console.log('Decrypted: ', { cm });
    addMessageToSession(address, cm);
}

export async function encryptAndSendMessage(from, to, message) {
    const address = new SignalProtocolAddress(to, 1);
    const cipher = new SessionCipher(SignalProtocolStore, address);

    const cm = {
        address: to,
        from: from._id,
        body: message,
    };
    addMessageToSession(to, cm);
    const signalMessage = await cipher.encrypt(new TextEncoder().encode(JSON.stringify(cm)).buffer);
    return signalMessage;
}
