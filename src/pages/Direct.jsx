import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { allContactsRoute, host } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Navbar from '../components/Navbar';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import { io } from "socket.io-client";

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

  const handleChatchange = (chat) => {
    setCurrentChat(chat);
  }

  return (
    <>
    <Navbar />
    <Container>
      <div className="container">
        <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatchange}/>
        {
          isLoaded && currentChat === undefined ? (<Welcome currentUser={currentUser}/>) : ( <ChatContainer currentChat={currentChat} currentUser={currentUser} isGroup={false} socket={socket}/> )
        }
        
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
    @media screen and (min-width: 720px) and (max-width:1080px) {
      grid-template-columns: 25% 65%;
    }
  }
`
export default Direct