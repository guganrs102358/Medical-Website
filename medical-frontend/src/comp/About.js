import React, { useState, useEffect } from 'react';
import './About.css';

const About = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [fadeClass, setFadeClass] = useState('fade-in');

    const images = [
        "http://localhost:3000/image/s1.jpg",
        "http://localhost:3000/image/s2.jpg",
        "http://localhost:3000/image/s4.jpg",
    ];

    
    useEffect(() => {
        const interval = setInterval(() => {
            setFadeClass('fade-out');
            setTimeout(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
                setFadeClass('fade-in');
            }, 1000); 
        }, 3000); 

        
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <>
        <div className="about-container">
            <h1>Annoor Medicals</h1>
            <div className="slider">
                <img
                    src={images[currentImageIndex]}
                    alt={`Annoor Medicals ${currentImageIndex + 1}`}
                    className={`about-image ${fadeClass}`}
                />
            </div>
            <div className="about-details">
                <p>Annoor Medicals</p>
                <p>Kangayam Road, Nathakadaiyur</p>
                <p>Tirupur District - 638108</p>
                <p>Contact: 9488089292</p>
            </div>
            <div className='map-details'>
            <iframe
            title="Annoor Medicals Location Map"
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d375.1962024975682!2d77.66094397807443!3d11.084658413112967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba99d0134c62531%3A0x83e82ed715fa21aa!2sAanoor%20Medicals!5e0!3m2!1sen!2sin!4v1728361278841!5m2!1sen!2sin"
  style={{ width: '600px', height: '450px', border: 0 }}
  allowFullScreen=""
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>
            </div>
        </div>
        </>
    );
};

export default About;
