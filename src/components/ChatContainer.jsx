import React, { useState, useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import axios from "axios";
import { sendDM, sendGroup, getDmMessages, getGroupMessages } from '../utils/APIRoutes';
import { v4 as uuidv4 } from "uuid";
import { Avatar, Typography, Box } from '@mui/material';

export default function ChatContainer({ currentChat, currentUser, isGroup, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();

  const getMessages = async () => {
    try {
      const response = await axios.post(isGroup ? getGroupMessages : getDmMessages, {
        sender: currentUser._id,
        recipient: isGroup ? null : currentChat._id,
        channel: isGroup ? currentChat._id : null,
      });
      setMessages(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (currentUser && currentChat) {
      getMessages();
    }
  }, [isGroup, currentUser, currentChat]);

  const handleSendMsg = async (msg) => {
    try {
      await axios.post(isGroup ? sendGroup : sendDM, {
        sender: currentUser._id,
        recipient: isGroup ? null : currentChat._id,
        channel: isGroup ? currentChat._id : null,
        message: msg,
      })
      socket.current.emit("send-msg", {
        sender: currentUser._id,
        recipient: isGroup ? null : currentChat._id,
        channel: isGroup ? currentChat._id : null,
        message: msg,
      })
      setMessages([...messages, { fromSelf: true, message: msg }]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-received", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      })
    }
  }, [])

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages])

  return (
    <>
      {currentChat && (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#424242', borderRadius: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #616161' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', spaceX: 2 }}>
              <Avatar sx={{ bgcolor: '#616161' }}>{currentChat.firstname.charAt(0)}</Avatar>
              <Typography variant="h6" sx={{ color: 'white', ml: 1 }}>
                {currentChat.firstname + ' ' + currentChat.secondname}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
            {messages.map((message, index) => (
              <Message key={uuidv4()} message={message} fromSelf={message.fromSelf} />
            ))}
            <div ref={scrollRef}></div>
          </Box>
          <Box sx={{ p: 2, borderTop: '1px solid #616161' }}>
            <ChatInput handleSendMsg={handleSendMsg} />
          </Box>
        </Box>
      )}
    </>
  );
}

function Message({ message, fromSelf }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: fromSelf ? 'flex-end' : 'flex-start', mb: 2 }}>
      <Box
        sx={{ px: 2, py: 1, borderRadius: '8px', backgroundColor: fromSelf ? '#616161' : '#1976d2', color: 'white' }}
      >
        {message.message}
      </Box>
    </Box>
  );
}
