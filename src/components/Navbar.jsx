import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Wasilah from '../assets/Wasilah.svg';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const nav = useNavigate();

  const isLoggedIn = () => {
    return localStorage.getItem('wasilah-user') !== null;
  };

  const handleLogout = () => {
    localStorage.removeItem('wasilah-user');
    nav('/login');
  };

  return (
    <NavbarContainer>
      <LogoLink to="/">
        <Logo src={Wasilah} alt="logo" />
      </LogoLink>
      <NavLinks>
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/groups">Groups</NavLink>
        {isLoggedIn() ? (
          <ButtonLink onClick={handleLogout}>Logout</ButtonLink>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
        {/* Add more links as needed */}
      </NavLinks>
    </NavbarContainer>
  );
};

const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #2e2d2d;
  color: #fcfcfc;
`;

const LogoLink = styled(Link)`
  text-decoration: none;
`;

const Logo = styled.img`
  height: 3rem;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #fcfcfc;
  font-weight: bold;
  font-size: 1rem;
  font-family: 'Montserrat', sans-serif;
  &:hover {
    color: #616161;
  }
`;

const ButtonLink = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #fcfcfc;
  font-weight: bold;
  font-size: 1rem;
  font-family: 'Montserrat', sans-serif;
  &:hover {
    color: #616161;
  }
`;

export default Navbar;
