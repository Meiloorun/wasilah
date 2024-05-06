import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

export default function Contacts({ contacts, currentUser, changeChat }) {
  const [currentName, setCurrentName] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    if (currentUser) {
      setCurrentName(currentUser.firstname + ' ' + currentUser.secondname);
    }
  }, [currentUser]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <Container>
      <ContactsList>
        {contacts.map((contact, index) => (
          <Contact
            key={index}
            selected={index === currentSelected}
            onClick={() => changeCurrentChat(index, contact)}
          >
            <ContactName>{contact.firstname + ' ' + contact.secondname}</ContactName>
          </Contact>
        ))}
      </ContactsList>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  background-color: #464646;
  overflow: hidden;
  font-family: 'Montserrat', sans-serif;
`;

const ContactsList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  gap: 1.5rem;
  padding-top: 1rem; /* Added padding-top */
  &::-webkit-scrollbar {
    width: 0.2rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #656565;
    border-radius: 1rem;
  }
`;

const Contact = styled.div`
  background-color: ${({ selected }) => (selected ? '#acacac' : '#656565')};
  min-height: 5rem;
  width: 90%;
  cursor: pointer;
  border-radius: 0.2rem;
  padding: 0.4rem;
  gap: 1rem;
  align-items: center;
  display: flex;
  transition: background-color 0.3s ease;
`;

const ContactName = styled.h3`
  color: #fcfcfc;
`;