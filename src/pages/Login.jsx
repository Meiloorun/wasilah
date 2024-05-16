import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import styled from 'styled-components';
import { loginRoute } from '../utils/APIRoutes';
import Logo from "../assets/Wasilah.svg";
import axios from "axios";
import { Box, TextField, Button, Typography, Container } from '@mui/material';


function Login() {
  const nav = useNavigate();

  useEffect(() => {
    if(localStorage.getItem('wasilah-user')) {
      nav('/');
    }
  })

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      console.log("validated", loginRoute);
      const { email, password } = formData;
      const { data } = await axios.post(loginRoute, {
        email,
        password,
      });
      console.log("user:", { data });
      if (data.status === true){
        localStorage.setItem('wasilah-user', JSON.stringify(data.user));
        nav("/");
      } else {
        setValidMsg(data.msg);
      }
      
    }
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [validMsg, setValidMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleValidation = () => {
    setValidMsg("");
    const { email, password } = formData;

    if (email === "") {
      setValidMsg("You must enter an Email.");
      return false;
    } else if (password === "") {
      setValidMsg("You must enter a Password.");
      return false;
    }

    return true;
  };

  return (
    <Container maxWidth="xl" className="h-screen flex justify-center items-center bg-gray-800">
      <Box className="w-full max-w-md p-8 bg-gray-700 rounded-lg shadow-lg">
        <Box component="form" onSubmit={handleSubmit} className="space-y-4">
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            InputProps={{
              className: 'bg-gray-800 text-gray-200',
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              className: 'bg-gray-800 text-gray-200',
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="bg-blue-500 hover:bg-blue-600"
          >
            Login
          </Button>
          {validMsg && (
            <Typography color="error" className="text-center">
              {validMsg}
            </Typography>
          )}
          <Typography variant="body2" className="text-gray-400 text-center">
            Not Registered? <Link to="/register" className="text-blue-500 hover:underline">Register Here</Link>
          </Typography>
        </Box>
      </Box>
      <Box className="hidden md:flex items-center justify-center bg-gray-900 rounded-lg shadow-lg p-8">
        <img src={Logo} alt="Wasilah Logo" className="max-w-xs" />
      </Box>
    </Container>
  );
}

export default Login;