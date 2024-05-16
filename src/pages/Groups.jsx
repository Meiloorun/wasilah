import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { getGroups, host } from '../utils/APIRoutes';
import Groups from '../components/Groups';
import Navbar from '../components/Navbar';
import Channels from '../components/Channels';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import { io } from "socket.io-client";
import { Box, Grid, Typography, CircularProgress } from '@mui/material';

function Group() {
  const socket = useRef();
  const nav = useNavigate();
  const [groups, setGroups] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentGroup, setCurrentGroup] = useState(undefined);
  const [currentChannel, setCurrentChannel] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 

  const setUser = async () => {
    const user = await JSON.parse(localStorage.getItem("wasilah-user"));
    setCurrentUser(user);
    setIsLoaded(true);

    const getGroup = async () => {
      if (user) {
        setIsLoading(true); 
        const data = await axios.get(`${getGroups}/${user._id}`);
        setGroups(data.data);
        setIsLoading(false);
      }
    };
    getGroup();
  }

  useEffect(() => {
    if (!localStorage.getItem("wasilah-user")) {
      nav("/login");
    } else {
      setUser();
    }
  }, [])

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser])

  const handleGroupChange = (group) => {
    setCurrentGroup(group);
    setCurrentChannel(undefined);
  }

  const handleChannelChange = (channel) => {
    setCurrentChannel(channel);
  }

  return (
    <>
      <Navbar />
      <Box className="h-screen w-full flex justify-center items-center bg-gray-800">
        <Grid container className="h-3/4 w-5/6 bg-gray-700 rounded-lg">
          <Grid item xs={3} className="border-r border-gray-600">
            {!isLoading && (
              <>
                <Groups groups={groups} currentUser={currentUser} changeGroup={handleGroupChange} />
                {currentGroup && (
                  <Channels currentGroup={currentGroup} changeChannel={handleChannelChange} />
                )}
              </>
            )}
          </Grid>
          <Grid item xs={9} className="p-4">
            {isLoading ? (
              <Box className="h-full w-full flex justify-center items-center">
                <CircularProgress />
              </Box>
            ) : isLoaded && currentGroup === undefined ? (
              <Welcome currentUser={currentUser} />
            ) : (
              <ChatContainer currentChat={currentChannel} currentUser={currentUser} isGroup={true} socket={socket} />
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default Group;
