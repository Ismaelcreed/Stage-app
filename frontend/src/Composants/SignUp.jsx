import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import "../assets/css/Login.css";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import logo from "../assets/images/logo.png";
import ReCAPTCHA from "react-google-recaptcha";
import { Toaster, toast } from 'sonner';
import { Spin } from "antd";
import gend from "../assets/images/login.gif"

const SIGN_UP_MUTATION = gql`
 mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      id
      username
      email
    }
  }
`;

const SignUp = () => {
    const [captchaValue, setCaptchaValue] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [signup, { data, loading, error }] = useMutation(SIGN_UP_MUTATION);

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
        console.log("Captcha value:", value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!captchaValue) {
            toast.error("Checker le reCAPTCHA s'il vous plait!");
            return;
        }
        if (password !== confirmPassword) {
            toast.info("Veuillez confirmer le mot de passe!");
            return;
        }

        try {
            const result = await signup({
                variables: {
                    username,
                    password,
                    email
                }
            });
            toast.success('Inscription réussi:', result.data.signup);
        } catch (err) {
            toast.error('Inscription en échec:', err);
        }
    };

    return (
        <>
            <Toaster />
            <div className="main-container">
                <div className="left-image">
                    <img src={gend} alt="Illustration" />
                </div>
                <motion.div
                    className="container-login"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    exit={{ x: window.innerWidth }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                >
                    <p className='title-login'><img src={logo} alt="logo" /></p>
                    <div className="formContent">
                        <form onSubmit={handleSubmit}>
                            <div className="inputBox">
                                <input
                                    type="text"
                                    placeholder="Votre nom d'utilisateur"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder='Email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder='Mot de passe'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder='Confirmer'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <ReCAPTCHA
                                sitekey="6Lc29S0qAAAAABuR00MS7tL0RgDzvoUyaejbyhrO"
                                onChange={handleCaptchaChange}
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? <Spin /> : 'Créer'}
                            </button>
                        </form>
                        <Link to={"/login"}><p className="link">Vous en avez déjà un?</p></Link>
                    </div>

                </motion.div>
            </div>
        </>
    );
};

export default SignUp;
