import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { loginRoute } from '../utils/APIRoutes';
import Logo from "../assets/Wasilah.svg";
import axios from "axios";

function Login() {
  const nav = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('wasilah-user')) {
      nav('/');
    }
  }, [nav]);

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
      if (data.status === true) {
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
    <div className="flex h-screen">
      <div className="w-1/2 bg-gray-800 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md p-8 bg-gray-500 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-200 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                required
                className="w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-800 text-gray-200"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-200 text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                required
                className="w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-800 text-gray-200"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded"
            >
              Login
            </button>
            {validMsg && (
              <p className="text-center text-red-500 mt-4">{validMsg}</p>
            )}
            <p className="text-gray-400 text-center mt-4">
              Not Registered? <Link to="/register" className="text-red-500 hover:underline">Register Here</Link>
            </p>
          </form>
        </div>
      </div>
      <div className="w-1/2 bg-gray-900 flex items-center justify-center">
        <img src={Logo} alt="Wasilah Logo" className="max-w-full max-h-full" />
      </div>
    </div>
  );
}

export default Login;
