// src/components/Login.jsx

import React, { useState , useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import "../assets/css/Login.css";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from "../assets/images/Logo_agir.png";
import { Toaster, toast } from 'sonner';
import gend from "../assets/images/Logo1.png";
import { Spin } from "antd"

const LOGIN_MUTATION = gql`
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    accessToken
    username
  }
}
`;





const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { loading }] = useMutation(LOGIN_MUTATION);
  const navigate = useNavigate();

  const handleLogin = async () => {
    let valid = true;

    if (!email.trim()) {
      valid = false;
      toast.info("Renseignez votre email!");
    }

    if (!password.trim()) {
      valid = false;
      toast.info("Confirmer votre mot de passe!");
    }
    if (valid) {
      try {
        const { data } = await login({
          variables: {
            email,
            password
          }
        });

        if (data && data.login) {
          const { accessToken, username } = data.login;
          localStorage.setItem('token', accessToken);
          localStorage.setItem('email', email);
          localStorage.setItem('username', username);
          if (email) {
            navigate('/home', { replace: true });
            console.log(email)
        }
        }
      } catch (err) {
        toast.error("Erreur lors de la tentative de connexion!");
        console.log(err.message);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <Toaster />
      <div className="main-container">
       
        <motion.div
          className="container-login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.4 }}
        >
          <p className='title-login'><img src={logo} alt="logo" /></p>
          <div className="formContent">
            <div className='inputBox'>
              <input
                type="email"
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type={passwordVisible ? 'text' : 'password'}
                placeholder='Mot de passe'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-visibility"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
              </span>
            </div>
            <button onClick={handleLogin} disabled={loading}>
              {loading ? <div className="sweet-loading">
                <Spin/>
              </div> : 'Se connecter'}
            </button>
            <Link to="/signup" className="link"><p>Créer un compte ?</p></Link>
          </div>
        </motion.div>
        <div className="top-content">
          <div className="top-left">
            <img src={gend} alt="Ministère de l'intérieur et de la décentralisation Madagascar" className="top-img" />
          </div>
          <div className="top-right">
            <h1 className="top-text"><strong>AGIR </strong>( <strong>A</strong>pplication de <strong>G</strong>estion des <strong>I</strong>nfractions <strong>R</strong>outières )</h1>
            <p className="top-copyright">© {new Date().getFullYear()} Ministère de l'intérieur et de la décentralisation Madagascar. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
