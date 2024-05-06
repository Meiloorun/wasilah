import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import styled from 'styled-components';
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
  })

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
    <>
    <Container>
        <FormContainer>
            <form onSubmit={(event)=>handleSubmit(event)}>
            <Row>
            <div>
                <input
                type="text"
                name="firstname"
                placeholder='First Name'
                value={formData.firstname}
                onChange={handleChange}
                />
                {errors.firstname && <span>{errors.firstname}</span>}
            </div>
            <div>
                <input
                type="text"
                name="secondname"
                placeholder='Second Name'
                value={formData.secondname}
                onChange={handleChange}
                />
                {errors.secondname && <span>{errors.secondname}</span>}
            </div>
            </Row>
            <div>
                <input
                type="number"
                name="aimsid"
                placeholder='AIMS ID'
                value={formData.aimsid}
                onChange={handleChange}
                />
                {errors.aimsid && <span>{errors.aimsid}</span>}
            </div>
            <div>
                <input
                type="email"
                name="email"
                placeholder='Email'
                value={formData.email}
                onChange={handleChange}
                />
                {errors.email && <span>{errors.email}</span>}
            </div>
            <div>
                <input
                type="password"
                name="password"
                placeholder='Password'
                value={formData.password}
                onChange={handleChange}
                />
                {errors.password && <span>{errors.password}</span>}
            </div>
            <div>
                <input
                type="password"
                name="confirmPassword"
                placeholder='Confirm Password'
                value={formData.confirmPassword}
                onChange={handleChange}
                />
                {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
            </div>
            <Row>
                <div>
                    <label htmlFor="female">Female</label>
                    <input type="radio" id="female" name="gender" value="female" onChange={handleChange} checked={formData.gender === 'female'} />
                </div>
                <div>
                    <label htmlFor="male">Male</label>
                    <input type="radio" id="male" name="gender" value="male" onChange={handleChange} checked={formData.gender === 'male'} />
                </div>
            </Row>
            <div>
                <label>Date of Birth</label>
                <input
                type="date"
                name="dateofbirth"
                value={formData.dateofbirth}
                onChange={handleChange}
                />
                {errors.dateofbirth && <span>{errors.dateofbirth}</span>}
            </div>
            <div>
              <input
                type="tel"
                name="phonenumber"
                placeholder='Phone Number'
                value={formData.phonenumber}
                onChange={handleChange}
              />
              {errors.phonenumber && <span>{errors.phonenumber}</span>}
            </div>
            <div>
                <label>Select Jamaat</label>
                <select
                    name="jamaat"
                    value={formData.jamaat}
                    onChange={handleChange}
                >
                    <option value="">Select Jamaat</option>
                    {jamaats.map((jamaat) => (
                        <option key={jamaat._id} value={jamaat._id}>
                            {jamaat.name}
                        </option>
                    ))}
                </select>
                {errors.jamaat && <span>{errors.jamaat}</span>}
            </div>
            <div>
                <button type="submit">Register</button>
            </div>
            <div>
                <span><a>{validMsg}</a></span>
            </div>
            <span>
                Already Registered? <Link to="/login">Login Here</Link>
            </span>
            </form>
        </FormContainer>

        <ImageContainer>
        <img src={Logo} alt='Wasilah Logo' />
      </ImageContainer>
      </Container>
    </>
  )
}

const Container = styled.div`
  display: flex;
  height: 100vh;
`;


const FormContainer = styled.div`
    height: 100vh;
    width: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #656565;
    form {
        span {
            color: #fcfcfc;
            text-transform: uppercase;
            font-family: 'Montserrat', sans-serif;
            a {
                color: #fa3e3e;
                text-decoration: none;
                font-weight: bold;
            }
        }
    }
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #222020;
  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;

  div {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;  /* Align items vertically in the middle */
    justify-content: flex-start;  /* Align items horizontally to the start of the container */
  }

  label {
    color: #fcfcfc;
    display: flex;  /* Make the label a flex container */
    align-items: center;  /* Align label contents vertically in the middle */
  }

  input {
    width: 100%;
  }
`;




export default Register