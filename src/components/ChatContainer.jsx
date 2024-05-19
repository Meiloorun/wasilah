import React, { useState, useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import axios from "axios";
import { sendDM, sendGroup, getDmMessages, getGroupMessages } from '../utils/APIRoutes';
import { v4 as uuidv4 } from "uuid";
import { Avatar, Typography, Box, Button } from '@mui/material';
import RoleAssignment from './RoleAssignment';

export default function ChatContainer({ currentChat, currentUser, isGroup, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [showRoleAssignment, setShowRoleAssignment] = useState(false);
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
  };

  useEffect(() => {
    if (currentUser && currentChat) {
      getMessages();
      if (isGroup) {
        socket.current.emit("join-channel", currentChat._id);
      }
    }

    return () => {
      if (isGroup && currentChat) {
        socket.current.emit("leave-channel", currentChat._id);
      }
    };
  }, [isGroup, currentUser, currentChat]);

  const handleSendMsg = async (msg) => {
    try {
      await axios.post(isGroup ? sendGroup : sendDM, {
        sender: currentUser._id,
        recipient: isGroup ? null : currentChat._id,
        channel: isGroup ? currentChat._id : null,
        message: msg,
      });
      socket.current.emit("send-msg", {
        sender: currentUser._id,
        recipient: isGroup ? null : currentChat._id,
        channel: isGroup ? currentChat._id : null,
        message: msg,
      });
      setMessages([...messages, { fromSelf: true, message: msg, sender: { firstname: currentUser.firstname, secondname: currentUser.secondname } }]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-received", (data) => {
        if (!currentChat) {
          console.error("currentChat is undefined when msg-received is triggered");
          return;
        }
        if ((isGroup && data.channel === currentChat._id) || (!isGroup && data.sender._id === currentChat._id)) {
          setArrivalMessage({ fromSelf: false, message: data.message, sender: data.sender });
        }
      });
    }
  }, [isGroup, currentChat]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <>
      {currentChat && (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#4F4F4F', borderRadius: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #616161' }}>
            {!isGroup && (
              <Box sx={{ display: 'flex', alignItems: 'center', spaceX: 2 }}>
                <Avatar sx={{ bgcolor: '#616161' }}>{currentChat.firstname.charAt(0)}</Avatar>
                <Typography variant="h6" sx={{ color: 'white', ml: 1 }}>
                  {currentChat.firstname + ' ' + currentChat.secondname}
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto', maxHeight: '540px'}}>
            {messages.map((message) => (
              <Message key={uuidv4()} message={message.message} fromSelf={message.fromSelf} sender={message.sender} isGroup={isGroup} />
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

function Message({ message, fromSelf, sender, isGroup }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: fromSelf ? 'flex-end' : 'flex-start', mb: 2 }}>
      <Box sx={{ maxWidth: '70%', textAlign: fromSelf ? 'right' : 'left' }}>
        {isGroup && !fromSelf && (
          <Typography variant="caption" sx={{ color: '#bdbdbd', display: 'block' }}>
            {sender.firstname} {sender.secondname}
          </Typography>
        )}
        <Box
          sx={{ px: 2, py: 1, borderRadius: '8px', backgroundColor: fromSelf ? '#616161' : '#1976d2', color: 'white' }}
        >
          {message}
        </Box>
      </Box>
    </Box>
  );
}
