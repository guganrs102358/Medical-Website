import React, { useState, useContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Nav from './comp/Nav';
import Rout from './comp/Rout';
//  import Footer from './comp/footer';
import Homeproduct from './comp/Home_product';
import './App.css';
import './index.css';
import Login from './comp/Login';
import SignUp from './comp/Register';
import Home from './comp/Home';
import { UserProvider, UserContext } from './UserContext';

function App() {
    const [cart, setCart] = useState([]);
    const [shop, setShop] = useState(Homeproduct);
    const [search, setSearch] = useState('');
    const { user, logoutUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [showLogout, setShowLogout] = useState(false);

    const Filter = (x) => {
        const catefilter = Homeproduct.filter((product) => product.cat === x);
        setShop(catefilter);
    };

    const allcatefilter = () => {
        setShop(Homeproduct);
    };

    const searchproduct = () => {
        console.log('Search Term:', search); 
        if (!search) {
            alert('Please Search Something!');
            setShop(Homeproduct);
        } else {
            const searchfilter = Homeproduct.filter((x) =>
                x.Name.toLowerCase().includes(search.toLowerCase()) ||
                x.cat.toLowerCase().includes(search.toLowerCase())
            );
            console.log('Filtered Products:', searchfilter); 
            setShop(searchfilter);
        }
    };

    const addtocart = (product) => {
        const exist = cart.find((x) => x.productId === product.productId);
        if (exist) {
            alert('This product is already added in cart');
        } else {
            setCart([...cart, { ...product, qty: 1 }]);
            alert('Added To cart');
        }
    };    

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const toggleLogout = () => {
        setShowLogout(!showLogout);
    };

    return (
        <UserProvider>
            <Nav search={search} setSearch={setSearch} searchproduct={searchproduct} toggleLogout={toggleLogout} />
            <Rout setCart={setCart} cart={cart} shop={shop} Filter={Filter} allcatefilter={allcatefilter} addtocart={addtocart} />
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/home" element={<Home addtocart={addtocart} />} />
                    </Routes>
                </div>
            </div>
            {/* <Footer /> */}
            {user && showLogout && (
                <div className="user-info">
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </UserProvider>
    );
}

export default App;