import React, { useState, useEffect, useRef } from 'react';
import styled from "styled-components";
import ChatInput from './ChatInput';
import axios from "axios";
import { sendDM, sendGroup, getDmMessages, getGroupMessages } from '../utils/APIRoutes';
import { v4 as uuidv4 } from "uuid";
import { SignalProtocolAddress, SessionBuilder, SessionCipher } from "@privacyresearch/libsignal-protocol-typescript";
import { SignalProtocolStore } from "../signal/signal-store";
import { processPreKeyMessage, processRegularMessage } from '../utils/messageprocessor';
import * as base64 from 'base64-js';


export default function ChatContainer({ currentChat, currentUser, isGroup, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  const [store, setStore] = useState(null);
  const [sesCipher, setSesCipher] = useState(null);

  const startSession = async () => {
    const keyBundle = currentChat.registration;

    console.log(keyBundle)

    const identityKey = base64.toByteArray(keyBundle.identityPubKey).buffer
    const signedPreKey = {
        keyId: keyBundle.publicSignedPreKey.keyId,
        publicKey: base64.toByteArray(keyBundle.publicSignedPreKey.publicKey),
        signature: base64.toByteArray(keyBundle.publicSignedPreKey.signature),
    }

    const preKey = keyBundle.oneTimePreKey && {
        keyId: keyBundle.oneTimePreKey[0].keyId,
        publicKey: base64.toByteArray(keyBundle.oneTimePreKey[0].publicKey),
    }
    const registrationId = keyBundle.registrationId

    const recipientAddress = new SignalProtocolAddress(currentChat._id, 1)

    const signalStore = new SignalProtocolStore()

    setStore(signalStore);

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
 
    const starterMessageBytes = Uint8Array.from([
      0xce, 0x93, 0xce, 0xb5, 0xce, 0xb9, 0xce, 0xac, 0x20, 0xcf, 0x83, 0xce, 0xbf, 0xcf, 0x85,
    ])

    const ciphertext = await sessionCipher.encrypt(starterMessageBytes.buffer)

    socket.current.emit("send-msg", {
      sender: currentUser._id,
      recipient: currentChat._id,
      message: ciphertext,
    })
    
    setSesCipher(sessionCipher)
    
  }

  const decryptMessage = async (ciphertext) => {
    let plaintext
    
    if (ciphertext.type === 3){
      plaintext = await sesCipher.decryptPreKeyWhisperMessage(ciphertext.body, 'binary')
    } else if (ciphertext.type === 1) {
      plaintext = await sesCipher.decryptWhisperMessage(ciphertext.body, 'binary')
    }

    const message = new TextDecoder().decode(new Uint8Array(plaintext))
    return message
  }



  const getDM = async () => {

    await startSession();

    const response = await axios.post(getDmMessages, {
      sender: currentUser._id,
      recipient: currentChat._id,
    });
    setMessages(response.data);
  }
  const getGroup = async () => {
    const response = await axios.post(getGroupMessages, {
      sender: currentUser._id,
      channel: currentChat._id,
    });
    setMessages(response.data);
  }
  
  useEffect(() =>{
    if (currentUser && currentChat) {
      if(!isGroup) { 
        getDM();
      } else {
        getGroup();
      }
    }
  },[isGroup, currentUser, currentChat]);

  const handleSendMsg = async (msg) => {
    if (!isGroup) {

      const buffer = new TextEncoder().encode(msg).buffer;

      const ciphertext = await sesCipher.encrypt(buffer)

      await axios.post(sendDM, {
        sender: currentUser._id,
        recipient: currentChat._id,
        message: ciphertext,
      })
      socket.current.emit("send-msg", {
        sender: currentUser._id,
        recipient: currentChat._id,
        message: ciphertext,
      })
    } else {
      await axios.post(sendGroup, {
        sender: currentUser._id,
        channel: currentChat._id,
        message: msg,
      })
      socket.current.emit("send-msg", {
        sender: currentUser._id,
        channel: currentChat._id,
        message: msg,
      })
    }
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg});
    setMessages(msgs);
  };

  useEffect(()=> {
    if(socket.current) {
      socket.current.on("msg-received", (msg)=>{
        setArrivalMessage({fromSelf: false, message: msg});
      })
    }
  },[])

  useEffect(()=> {
    arrivalMessage && setMessages((prev) =>[...prev, arrivalMessage]);
  }, [arrivalMessage])

  useEffect(()=>{
    const scrollToBottom = () => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    };
  
    scrollToBottom();
  },[messages])

  return (
    <>
    { currentChat && (
    <Container>
        <ChatHeader>
            <ChatterInfo>
              <UserName>{currentChat.firstname + ' ' + currentChat.secondname}</UserName>
            </ChatterInfo>
        </ChatHeader>
        <ChatMessages>
          {messages.map((message) => (
            <MessageWrapper key={uuidv4()} ref={scrollRef} fromSelf={message.fromSelf}>
              <MessageContent fromSelf={message.fromSelf}>
                {decryptMessage(message.message)}
              </MessageContent>
            </MessageWrapper>
          ))}
          <div ref={scrollRef}></div>
        </ChatMessages>
        <ChatInputWrapper>
          <ChatInput handleSendMsg={handleSendMsg}/>
        </ChatInputWrapper>
    </Container>
    )}
    </>
  )
}

const Container = styled.div`
  padding-top: 1rem;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 0.1rem;
  overflow: hidden;
  font-family: 'Montserrat', sans-serif;
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
`;

const ChatterInfo = styled.div`
  background-color: #333333; /* Background color for the chatter's name */
  padding: 0.5rem 1rem; /* Adjust padding as needed */
  border-radius: 0.5rem; /* Adjust border-radius as needed */
`;

const UserName = styled.h3`
  color: #fcfcfc;
`;

const ChatMessages = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: auto;
`;

const MessageWrapper = styled.div`
  display: flex;
  justify-content: ${({ fromSelf }) => (fromSelf ? "flex-end" : "flex-start")};
`;

const MessageContent = styled.div`
  max-width: 70%;
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  border-radius: 1rem;
  color: #fff;
  background-color: ${({ fromSelf }) => (fromSelf ? "#4c4c4c" : "#1f1f1f")};
`;

const ChatInputWrapper = styled.div`
  padding: 1rem;
`;
