import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { registerRoute, getJamaats } from '../utils/APIRoutes';
import { createIdentity } from '../utils/identity';
import * as base64 from 'base64-js';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';

function Register() {
  const nav = useNavigate();
  const [jamaats, setJamaats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('wasilah-user')) {
      nav('/');
    }
  }, [nav]);

  useEffect(() => {
    const fetchJamaats = async () => {
      try {
        const response = await axios.get(getJamaats);
        setJamaats(response.data.jamaats);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Jamaats', error);
        setLoading(false);
      }
    };
    fetchJamaats();
  }, []);

  const base64FromArrayBuffer = (arrayBuffer) => {
    return base64.fromByteArray(new Uint8Array(arrayBuffer));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { publicSignedPreKey, oneTimePreKey, identityPubKey, registrationId } = await createIdentity();
    const publicSignedPreKeyBase64 = {
      keyId: publicSignedPreKey.keyId,
      publicKey: base64FromArrayBuffer(publicSignedPreKey.publicKey),
      signature: base64FromArrayBuffer(publicSignedPreKey.signature),
    };

    const oneTimePreKeyBase64 = oneTimePreKey.map((key) => ({
      keyId: key.keyId,
      publicKey: base64FromArrayBuffer(key.publicKey),
    }));

    const identityPubKeyBase64 = base64FromArrayBuffer(identityPubKey);

    if (handleValidation()) {
      const { password, firstname, secondname, email, aimsid, phonenumber, dateofbirth, jamaat, gender } = formData;
      const { data } = await axios.post(registerRoute, {
        firstname,
        secondname,
        email,
        password,
        aimsid,
        phonenumber,
        dateofbirth,
        jamaat,
        gender,
        publicSignedPreKey: publicSignedPreKeyBase64,
        oneTimePreKey: oneTimePreKeyBase64,
        identityPubKey: identityPubKeyBase64,
        registrationId,
      });
      if (data.status === false) {
        setValidMsg(data.msg);
      }
      if (data.status === true) {
        localStorage.setItem('wasilah-user', JSON.stringify(data.user));
        nav('/');
      }
    }
  };

  const [formData, setFormData] = useState({
    firstname: '',
    secondname: '',
    email: '',
    password: '',
    confirmPassword: '',
    aimsid: '',
    phonenumber: '',
    dateofbirth: '',
    jamaat: '',
    gender: '',
  });

  const [validMsg, setValidMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleValidation = () => {
    setValidMsg('');
    const { password, confirmPassword, firstname, secondname, email, aimsid, gender, dateofbirth, jamaat } = formData;
    if (password !== confirmPassword) {
      setValidMsg('Your Confirmed Password was not the same as your Password.');
      return false;
    } else if (aimsid.length !== 5) {
      setValidMsg('AIMS ID does not have the right length.');
      return false;
    } else if (email === '') {
      setValidMsg('You must enter an Email.');
      return false;
    } else if (firstname === '') {
      setValidMsg('You must enter your First Name.');
      return false;
    } else if (secondname === '') {
      setValidMsg('You must enter your Second Name.');
      return false;
    } else if (gender === '') {
      setValidMsg('You must select your Gender.');
      return false;
    } else if (password === '') {
      setValidMsg('You must enter a Password.');
      return false;
    } else if (dateofbirth === '') {
      setValidMsg('You must enter your Date of Birth.');
      return false;
    } else if (jamaat === '') {
      setValidMsg('You must select your Jamaat.');
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
            id="firstname"
            label="First Name"
            name="firstname"
            value={formData.firstname}
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
            id="secondname"
            label="Second Name"
            name="secondname"
            value={formData.secondname}
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
            id="aimsid"
            label="AIMS ID"
            name="aimsid"
            value={formData.aimsid}
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
            id="email"
            label="Email"
            name="email"
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
            value={formData.password}
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
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            InputProps={{
              className: 'bg-gray-800 text-gray-200',
            }}
          />
          <FormControl component="fieldset" className="text-gray-200">
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup
              row
              aria-label="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
            </RadioGroup>
          </FormControl>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="dateofbirth"
            label="Date of Birth"
            name="dateofbirth"
            type="date"
            value={formData.dateofbirth}
            onChange={handleChange}
            InputProps={{
              className: 'bg-gray-800 text-gray-200',
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="phonenumber"
            label="Phone Number"
            name="phonenumber"
            value={formData.phonenumber}
            onChange={handleChange}
            InputProps={{
              className: 'bg-gray-800 text-gray-200',
            }}
          />
          <FormControl fullWidth variant="outlined" className="bg-gray-800 text-gray-200">
            <InputLabel id="jamaat-label" className="text-gray-400">
              Select Jamaat
            </InputLabel>
            <Select
              labelId="jamaat-label"
              id="jamaat"
              name="jamaat"
              value={formData.jamaat}
              onChange={handleChange}
              label="Select Jamaat"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {loading ? (
                <MenuItem disabled>
                  <CircularProgress size={20} />
                </MenuItem>
              ) : (
                jamaats.map((jamaat) => (
                  <MenuItem key={jamaat._id} value={jamaat._id}>
                    {jamaat.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="bg-blue-500 hover:bg-blue-600"
          >
            Register
          </Button>
          {validMsg && (
            <Typography color="error" className="text-center">
              {validMsg}
            </Typography>
          )}
          <Typography variant="body2" className="text-gray-400 text-center">
            Already Registered? <Link to="/login" className="text-blue-500 hover:underline">Login Here</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default Register;