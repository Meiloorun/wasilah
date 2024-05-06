import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

export default function Groups({ groups, currentUser, changeGroup }) {
  const [currentName, setCurrentName] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [groupArray, setGroupArray] = useState([])

  useEffect(() => {
    if (currentUser) {
      setCurrentName(`${currentUser.firstname} ${currentUser.secondname}`);
    }

    if (!Array.isArray(groups)) {
        console.log("Converting groups to an array");
        setGroupArray([groups])
      } else {
        setGroupArray([groups])
      }
  }, [currentUser, groups]);

  const changeCurrentGroup = (index, group) => {
    setCurrentSelected(index);
    changeGroup(group);
  };

  return (
    <Container>
      <GroupsList>
        {console.log(groupArray)}
        {groupArray.length >= 0 ? (
          groupArray[0].groups.map((group, index) => (
            <Group
              key={index}
              selected={index === currentSelected}
              onClick={() => changeCurrentGroup(index, group)}
            >
              <GroupName>{group?.name || 'Unnamed Group'}</GroupName>
              {console.log(group)}
            </Group>
          ))
        ) : (
          <NoGroupsMessage>No groups found</NoGroupsMessage>
        )}
      </GroupsList>
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

const GroupsList = styled.div`
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

const Group = styled.div`
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

const GroupName = styled.h3`
  color: #fcfcfc;
`;

const NoGroupsMessage = styled.div`
  color: #fcfcfc;
  font-size: 1.2rem;
  text-align: center;
`;