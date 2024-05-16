import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { allContactsRoute, host } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Navbar from '../components/Navbar';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import { io } from "socket.io-client";
import { Box, Grid } from '@mui/material';

function Direct() {
  const socket = useRef();
  const nav = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  const setUser = async () => {
    setCurrentUser(await JSON.parse(localStorage.getItem("wasilah-user")));
    setIsLoaded(true);
  }

  const getContacts = async () => {
    const data = await axios.get(`${allContactsRoute}/${currentUser._id}`);
    setContacts(data.data);
  }

  useEffect(()=>{
    if (!localStorage.getItem("wasilah-user")){
      nav("/login");
    } else {
      setUser();
    }
  }, [])

  useEffect(() => {
    if(currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  },[currentUser])

  useEffect(()=> {
    if(currentUser){
      getContacts();
    };
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  }

  return (
    <>
      <Navbar />
      <Box className="h-screen w-full flex justify-center items-center bg-gray-800">
        <Grid container className="h-3/4 w-5/6 bg-gray-700 rounded-lg">
          <Grid item xs={3} className="border-r border-gray-600">
            <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
          </Grid>
          <Grid item xs={9} className="p-4">
            {isLoaded && currentChat === undefined ? (
              <Welcome currentUser={currentUser} />
            ) : (
              <ChatContainer currentChat={currentChat} currentUser={currentUser} isGroup={false} socket={socket} />
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default Direct;
