import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext'; 

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { registerUser } = useContext(UserContext);

    
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^\d{10}$/; 
        return phoneRegex.test(phone);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (!validatePhone(phone)) {
            alert('Please enter a valid 10-digit mobile number.');
            return;
        }

        axios.post('http://localhost:3001/register', { name, email, phone, password })
            .then(result => {
                console.log(result);
                if (result.status === 200) {
                    registerUser({ name, email }); 
                    navigate('/home');
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div className='contact'>
            <div className='container'>
                <div className='form'>
                    <h2>Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='box'>
                            <div className='label'>
                                <h4>Name</h4>
                            </div>
                            <div className='input'>
                                <input 
                                    type='text' 
                                    placeholder='Enter Your Name' 
                                    name="name" 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>
                        <div className='box'>
                            <div className='label'>
                                <h4>Email</h4>
                            </div>
                            <div className='input'>
                                <input 
                                    type='email' 
                                    placeholder='Enter Your Email' 
                                    name="email" 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>
                        <div className='box'>
                            <div className='label'>
                                <h4>Mobile Number</h4>
                            </div>
                            <div className='input'>
                                <input 
                                    type='text' 
                                    placeholder='Enter Your Mobile Number' 
                                    name="phone" 
                                    onChange={(e) => setPhone(e.target.value)} 
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
                        <button type='submit'>Register</button>
                    </form>
                    <p>Already have an account?</p>
                    <Link to='/login'>
                        <button type='button'>Login</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
