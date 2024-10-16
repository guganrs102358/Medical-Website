import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext'; 
import './Contact.css';

const Contact = () => {
  const [user, setUser] = useState({
    Name: '',
    email: '',
    subject: '',
    Message: '',
  });

  const { user: loggedInUser } = useContext(UserContext); 
  const navigate = useNavigate();

  const data = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validateFields = () => {
    const { Name, email, subject, Message } = user;
    return Name && email && subject && Message;
  };

  const send = async (e) => {
    e.preventDefault();

    if (!loggedInUser) {
      navigate('/login');
      alert('Please login to send a message.');
      return;
    }

    if (!validateFields()) {
      alert('Please fill in all the fields before sending the message.');
      return;
    }

    const { Name, email, subject, Message } = user;

    const option = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Name,
        email,
        subject,
        Message,
      }),
    };

    try {
      const response = await fetch('http://localhost:3001/contact', option);

      if (response.ok) {

        const phoneNumber = '6383576850';
        const whatsappMessage = `Subject: ${subject}\nMessage: ${Message}`;
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

        window.location.href = whatsappURL;
      } else {
        alert('Error Occurred, Message Send Failed');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error Occurred, Message Send Failed');
    }
  };

  return (
    <div className='contact'>
      <div className='container'>
        <div className='form'>
          <h2>#contact us</h2>
          <form>
            <div className='box'>
              <div className='label'>
                <h4>Name</h4>
              </div>
              <div className='input'>
                <input
                  type='text'
                  placeholder='Name'
                  value={user.Name}
                  name='Name'
                  onChange={data}
                  required
                />
              </div>
            </div>
            <div className='box'>
              <div className='label'>
                <h4>E-mail</h4>
              </div>
              <div className='input'>
                <input
                  type='email'
                  placeholder='E-mail'
                  value={user.email}
                  name='email'
                  onChange={data}
                  required
                />
              </div>
            </div>
            <div className='box'>
              <div className='label'>
                <h4>Subject</h4>
              </div>
              <div className='input'>
                <input
                  type='text'
                  placeholder='Subject'
                  value={user.subject}
                  name='subject'
                  onChange={data}
                  required
                />
              </div>
            </div>
            <div className='box'>
              <div className='label'>
                <h4>Message</h4>
              </div>
              <div className='input'>
                <input
                  type='text'
                  placeholder='Message!'
                  value={user.Message}
                  name='Message'
                  onChange={data}
                  required
                />
              </div>
            </div>
            <button type='submit' onClick={send}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
