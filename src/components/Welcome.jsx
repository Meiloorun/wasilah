import React from 'react'
import styled from 'styled-components'

export default function Welcome({ currentUser }) {
  return (
    <Container>
        <img />
        <h1>
            Assalamo Alaikum, <span>{currentUser.firstname + ' ' + currentUser.secondname}</span>
        </h1>
    </Container>
  )
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: #fcfcfc;
    span {
        color: #fa3e3e;
    }
`;