import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import styled from 'styled-components';
import { loginRoute } from '../utils/APIRoutes';
import Logo from "../assets/Wasilah.svg";
import axios from "axios";


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
    <>
      <Container>
        <FormContainer>
          <form onSubmit={(event) => handleSubmit(event)}>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span>{errors.email}</span>}
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span>{errors.password}</span>}
            </div>
            <div>
              <button type="submit">Login</button>
            </div>
            <div>
              <span>
                <a>{validMsg}</a>
              </span>
            </div>
            <span>
              Not Registered? <Link to="/register">Register Here</Link>
            </span>
          </form>
        </FormContainer>

        <ImageContainer>
          <img src={Logo} alt="Wasilah Logo" />
        </ImageContainer>
      </Container>
    </>
  );
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

export default Login;