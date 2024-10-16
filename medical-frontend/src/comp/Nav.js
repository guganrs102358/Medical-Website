import React, { useContext, useState, useEffect } from 'react';
// import { AiOutlineSearch } from 'react-icons/ai';
import { FiLogIn } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import './Nav.css';

const Nav = ({ search, setSearch, searchproduct }) => {
    const { user, logoutUser } = useContext(UserContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setShowDropdown(false); 
    }, [user]);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/home');
        setShowDropdown(false); 
    };

    const handleDashboard = () => {
        navigate('/dashboard');
        setShowDropdown(false); 
    };

    return (
        <>
            <div className='header'>
                <div className='top_header'>
                </div>
                <div className='mid_header'>
                    <div className='logo'>
                        <img src='image/l.png' alt='logo' />
                    </div>
                    {/* <div className='search_box'>
                        <input
                            type='text'
                            value={search}
                            placeholder='Search'
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button onClick={searchproduct}>
                            <AiOutlineSearch />
                        </button>
                    </div> */}
                    <div className='user'>
                        <div className='icon'>
                            <FiLogIn />
                        </div>
                        <div className='btn'>
                            {user ? (
                                <div style={{ position: 'relative' }}>
                                    <button onClick={toggleDropdown}>
                                        {user.name}
                                    </button>
                                    {showDropdown && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '100%',
                                                right: 0,
                                                backgroundColor: '#fff',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                                zIndex: 1000,
                                            }}
                                        >
                                            {user.role === 'admin' && (
                                                <button
                                                    onClick={handleDashboard}
                                                    style={{
                                                        display: 'block',
                                                        padding: '10px',
                                                        border: 'none',
                                                        backgroundColor: '#4CAF50',
                                                        color: '#fff',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        textAlign: 'center',
                                                        width: '100%',
                                                    }}
                                                >
                                                    Dashboard
                                                </button>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                style={{
                                                    display: 'block',
                                                    padding: '10px',
                                                    border: 'none',
                                                    backgroundColor: '#f44336',
                                                    color: '#fff',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    textAlign: 'center',
                                                    width: '100%',
                                                }}
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link to='/login' className='link'>
                                    <button>Login</button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                <div className='last_header'>
                    <div className='user_profile'>
                        <div className='info'>
                            <p>Annoor Medicals</p>
                        </div>
                    </div>
                    <div className='nav'>
                        <ul>
                            <li>
                                <Link to='/' className='link'>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to='/shop' className='link'>
                                    Shop
                                </Link>
                            </li>
                            <li>
                                <Link to='/cart' className='link'>
                                    Cart
                                </Link>
                            </li>
                            <li>
                                <Link to='/about' className='link'>
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link to='/contact' className='link'>
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className='offer'>
                        <p>ANNOOR MEDICALS</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Nav;