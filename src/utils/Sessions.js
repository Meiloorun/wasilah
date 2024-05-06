import { SignalProtocolAddress, SessionBuilder, SessionCipher } from "@privacyresearch/libsignal-protocol-typescript";
import { SignalProtocolStore } from "../signal/signal-store";

export async function startSession(recipient) {
    const keyBundle = recipient.registration;

    const identityKey = base64.toByteArray(keyBundle.identityKey).buffer
    const signedPreKey = {
        keyId: keyBundle.signedPreKey.keyId,
        publicKey: base64.toByteArray(keyBundle.signedPreKey.publicKey),
        signature: base64.toByteArray(keyBundle.signedPreKey.signature),
    }
    const preKey = keyBundle.preKey && {
        keyId: keyBundle.preKey.keyId,
        publicKey: base64.toByteArray(keyBundle.preKey.publicKey),
    }
    const registrationId = keyBundle.registrationId

    const recipientAddress = new SignalProtocolAddress(recipient.firstname + ' ' + recipient.secondname, 1)

    const signalStore = new SignalProtocolStore()

    const sessionBuilder = new SessionBuilder(signalStore, recipientAddress);

    const newKeyBundle = {
        identityKey,
        signedPreKey,
        preKey,
        registrationId,
    }

    const session = sessionBuilder.processPreKey(newKeyBundle)

    console.log({ session, newKeyBundle })

    const sessionCipher = new SessionCipher(signalStore, recipientAddress)
    const ciphertext = await sessionCipher.encrypt(Uint8Array.from([0, 0, 0, 0]).buffer)
}