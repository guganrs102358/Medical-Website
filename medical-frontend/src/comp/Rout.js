import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Shop from './Shop';
import Cart from './Cart';
import Contact from './Contact';
import Dashboard from './Dashboard';
import Payment from './Payment'; 
import About from './About'; 


const Rout = ({ shop, Filter, allcatefilter, addtocart, cart, setCart }) => {
  return (
    <Routes>
      <Route path="/" element={<Home addtocart={addtocart} />} />
      <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
      <Route
        path="/shop"
        element={<Shop shop={shop} Filter={Filter} allcatefilter={allcatefilter} addtocart={addtocart} />}
      />
      <Route path="/contact" element={<Contact />} />
      <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard route */}
      <Route path="/payment" element={<Payment />} /> {/* Add the Payment route */}
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

export default Rout;
