import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../UserContext'; 
import './Login.css';

function Login() {
    const { loginUser } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/login', { email, password })
            .then(result => {
                console.log(result);
                if (result.status === 200) {
                    toast.success('Login successful');
                    loginUser({ name: result.data.username, role: result.data.role }); 
                    navigate('/home');
                } else {
                    toast.error(result.data);
                }
            })
            .catch(err => {
                console.error(err);
                toast.error('Login failed');
            });
    };

    return (
        <div className='contact'>
            <div className='container'>
                <div className='form'>
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='box'>
                            <div className='label'>
                                <h4>Email</h4>
                            </div>
                            <div className='input'>
                                <input 
                                    type='email' 
                                    placeholder='Enter Your Email ID' 
                                    autoComplete='on' 
                                    name="email" 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>
                        <div className='box'>
                            <div className='label'>
                                <h4>Password</h4>
                            </div>
                            <div className='input'>
                                <input 
                                    type='password' 
                                    placeholder='Enter Your Password' 
                                    name="password" 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>
                        <button type='submit'>Submit</button>
                    </form>
                    <p>Don't Have an account?</p>
                    <Link to='/signup' className='register-link'>
                        Register
                    </Link>
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
}

export default Login;
