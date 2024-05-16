import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Wasilah from '../assets/Wasilah.svg';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

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
    <AppBar position="static" sx={{ backgroundColor: '#424242' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/">
            <img src={Wasilah} alt="logo" style={{ height: '48px', marginRight: '16px' }} />
          </Link>
          <Typography variant="h6" sx={{ color: 'white' }}>
            Wasilah
          </Typography>
        </Box>
        <Box sx={{ ml: 'auto' }}>
          <Link to="/home" sx={{ color: 'white', textDecoration: 'none', mr: '16px', '&:hover': { color: '#9e9e9e' } }}>
            Home
          </Link>
          <Link to="/groups" sx={{ color: 'white', textDecoration: 'none', mr: '16px', '&:hover': { color: '#9e9e9e' } }}>
            Groups
          </Link>
          {isLoggedIn() ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Link to="/login" sx={{ color: 'white', textDecoration: 'none', '&:hover': { color: '#9e9e9e' } }}>
              Login
            </Link>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
