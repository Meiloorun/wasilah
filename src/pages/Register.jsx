import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import Logo from "../assets/Wasilah.svg";
import axios from "axios";
import { registerRoute, getJamaats } from '../utils/APIRoutes';
import { createIdentity } from '../utils/identity';
import * as base64 from 'base64-js'

function Register() {
  const nav = useNavigate();
  const [jamaats, setJamaats] = useState([]);

  useEffect(() => {
    if(localStorage.getItem('wasilah-user')) {
      nav('/');
    }
  }, [nav])

  useEffect(() => {
    const fetchJamaats = async () => {
      try {
        const response = await axios.get(getJamaats);
        setJamaats(response.data.jamaats);
        console.log(response.data.jamaats);
      } catch (error) {
        console.error('Error fetching Jamaats', error);
      }
    };
    fetchJamaats();
  }, []);

  const base64FromArrayBuffer = (arrayBuffer) => {
    return (base64.fromByteArray(new Uint8Array(arrayBuffer)))
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const {publicSignedPreKey, oneTimePreKey, identityPubKey, registrationId} = await createIdentity();
    const publicSignedPreKeyBase64 = {
      keyId: publicSignedPreKey.keyId,
      publicKey: base64FromArrayBuffer(publicSignedPreKey.publicKey),
      signature: base64FromArrayBuffer(publicSignedPreKey.signature)
    };
    
    const oneTimePreKeyBase64 = oneTimePreKey.map(key => ({
        keyId: key.keyId,
        publicKey: base64FromArrayBuffer(key.publicKey)
    }));

    const identityPubKeyBase64 = base64FromArrayBuffer(identityPubKey);

    console.log("publicSignedPreKey: ", publicSignedPreKey);
    console.log("oneTimePreKey: ", oneTimePreKey);
    console.log("identityPubKey: ", identityPubKey);
    console.log("registrationId: " ,registrationId);
    if (handleValidation()) {
      console.log("validated", registerRoute)
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
        nav("/");
      }
    }
  }

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

  const [errors, setErrors] = useState({});
  const [validMsg, setValidMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleValidation = () => {
    setValidMsg("")
    const { password, confirmPassword, firstname, secondname, email, aimsid, gender, dateofbirth, jamaat } = formData;
    if (password !== confirmPassword){
        setValidMsg("Your Confirmed Password was not the same as your Password.");
        return false;
    } else if (aimsid.length !== 5) {
        setValidMsg("AIMS ID does not have the right length.");
        return false;
    } else if (email===""){
        setValidMsg("You must enter an Email.");
        return false;
    } else if (firstname==="") {
        setValidMsg("You must enter your First Name.");
        return false;
    } else if (secondname===""){
        setValidMsg("You must enter your Second Name.");
        return false;
    } else if (gender===""){
        setValidMsg("You must select your Gender.");
    } else if (password===""){
        setValidMsg("You must enter a Password.");
    } else if (dateofbirth===""){
        setValidMsg("You must enter your Date of Birth.");
    } else if (jamaat===""){
        setValidMsg("You must select your Jamaat.");
    }
    return true;
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gray-800 flex flex-col justify-center items-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              name="firstname"
              placeholder='First Name'
              value={formData.firstname}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-white"
            />
            <input
              type="text"
              name="secondname"
              placeholder='Second Name'
              value={formData.secondname}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-white"
            />
          </div>
          <input
            type="number"
            name="aimsid"
            placeholder='AIMS ID'
            value={formData.aimsid}
            onChange={handleChange}
            className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-white"
          />
          <input
            type="email"
            name="email"
            placeholder='Email'
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-white"
          />
          <input
            type="password"
            name="password"
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-white"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder='Confirm Password'
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-white"
          />
          <div className="flex gap-4 mb-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                onChange={handleChange}
                checked={formData.gender === 'female'}
                className="mr-2 bg-gray-700 border-gray-600 focus:ring-red-500"
                />
                <label htmlFor="female" className="text-white">Female</label>
                </div>
                <div className="flex items-center">
                <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                onChange={handleChange}
                checked={formData.gender === 'male'}
                className="mr-2 bg-gray-700 border-gray-600 focus:ring-red-500"
                />
                <label htmlFor="male" className="text-white">Male</label>
                </div>
                </div>
                <div className="mb-4">
                <label htmlFor="dateofbirth" className="text-white block mb-2">Date of Birth</label>
                <input
                           type="date"
                           name="dateofbirth"
                           value={formData.dateofbirth}
                           onChange={handleChange}
                           className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-white"
                         />
                </div>
                <input
                         type="tel"
                         name="phonenumber"
                         placeholder='Phone Number'
                         value={formData.phonenumber}
                         onChange={handleChange}
                         className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-white"
                       />
                <div className="mb-4">
                <label htmlFor="jamaat" className="text-white block mb-2">Select Jamaat</label>
                <select
                           name="jamaat"
                           value={formData.jamaat}
                           onChange={handleChange}
                           className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-white"
                         >
                <option value="">Select Jamaat</option>
                {jamaats.map((jamaat) => (
                <option key={jamaat._id} value={jamaat._id}>
                {jamaat.name}
                </option>
                ))}
                </select>
                </div>
                <button
                         type="submit"
                         className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                       >
                Register
                </button>
                <div className="mb-4">
                <span className="text-red-500">{validMsg}</span>
                </div>
                <div className="text-white">
                Already Registered? <Link to="/login" className="text-red-600 hover:underline">Login Here</Link>
                </div>
                </form>
                </div>
                <div className="w-1/2 bg-gray-900 flex items-center justify-center">
                <img src={Logo} alt='Wasilah Logo' className="max-w-full max-h-full" />
                </div>
                </div>
                )
                }
                export default Register