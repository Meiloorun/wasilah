import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { getGroups, host } from '../utils/APIRoutes';
import Groups from '../components/Groups';
import Navbar from '../components/Navbar';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import { io } from "socket.io-client";

function Group() {
  const socket = useRef();
  const nav = useNavigate();
  const [groups, setGroups] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentGroup, setCurrentGroup] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const setUser = async () => {
    const user = await JSON.parse(localStorage.getItem("wasilah-user"));
    setCurrentUser(user);
    setIsLoaded(true);

    // Fetch groups data after currentUser is set
    const getGroup = async () => {
      if (user) {
        setIsLoading(true); // Set loading state to true before fetching data
        const data = await axios.get(`${getGroups}/${user._id}`);
        setGroups(data.data);
        setIsLoading(false); // Set loading state to false after fetching data
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
  }

  return (
    <>
      <Navbar />
      <Container>
        <div className="container">
          {!isLoading && ( // Render Groups component only when not loading
            <Groups groups={groups} currentUser={currentUser} changeGroup={handleGroupChange} />
          )}
          {isLoading && <LoadingMessage>Loading groups...</LoadingMessage>} {/* Render loading message when loading */}
          {isLoaded && currentGroup === undefined ? (
            <Welcome currentUser={currentUser} />
          ) : (
            <ChatContainer currentGroup={currentGroup} currentUser={currentUser} isGroup={true} socket={socket} />
          )}
        </div>
      </Container>
    </>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #222020;
  .container {
    height: 75vh;
    width: 85vw;
    background-color: #464646;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 25% 65%;
    }
  }
`;

const LoadingMessage = styled.div`
  color: #fcfcfc;
  font-size: 1.2rem;
  text-align: center;
`;

export default Group;