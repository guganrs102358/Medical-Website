import React, { useEffect, useState, useContext } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import Homeproduct from './Home_product';
import { UserContext } from '../UserContext'; 

const Home = ({ addtocart }) => {
  const [newProduct, setNewProduct] = useState([]);
  const [featuredProduct, setFeaturedProduct] = useState([]);
  const [topProduct, setTopProduct] = useState([]);

  const [trendingProduct, setTrendingProduct] = useState(Homeproduct);

  const { user } = useContext(UserContext);  
  const navigate = useNavigate();  

  // Filter by product type
  const filterByCategory = (type) => {
    const filteredProducts = Homeproduct.filter((product) => product.type === type);
    setTrendingProduct(filteredProducts);
  };

  // Show all trending products
  const showAllTrendingProducts = () => {
    setTrendingProduct(Homeproduct);
  };

  // Load product categories on component mount
  useEffect(() => {
    loadProductCategories();
  }, []);

  // Function to categorize products
  const loadProductCategories = () => {
    // New Products
    const newCategory = Homeproduct.filter((product) => product.type === 'new');
    setNewProduct(newCategory);

    // Featured Products
    const featuredCategory = Homeproduct.filter((product) => product.type === 'featured');
    setFeaturedProduct(featuredCategory);

    // Top Products
    const topCategory = Homeproduct.filter((product) => product.type === 'top');
    setTopProduct(topCategory);
  };

  // Handle "Shop Now" button click
  const handleShopNow = () => {
    // Check if the user is logged in
    if (!user) {
      alert('Please Login')
      navigate('/login');
    } else {
      // If logged in, redirect to the shop page
      navigate('/shop');
    }
  };

  return (
    <>
      <div className='home'>
        <div className='top_banner'>
          <div className='contant'>
            <h3>Annoor</h3>
            <h2>Medicals</h2>
            <br />
            <button className='link' onClick={handleShopNow}>
              Shop Now
            </button>
          </div>
        </div>
        <div className='trending'>
          <div className='container'>
            <div className='left_box'>
              <div className='header'>
                <div className='heading'>
                  <h2 onClick={showAllTrendingProducts}>Top Brands</h2>
                </div>
                <div className='cate'>
                  <h3 onClick={() => filterByCategory('new')}>CIPLA</h3>
                  <h3 onClick={() => filterByCategory('featured')}>MANKIND</h3>
                  <h3 onClick={() => filterByCategory('top')}>ORIMIS</h3>
                </div>
              </div>
              <div className='products'>
                <div className='container'>
                  {trendingProduct.map((product) => (
                    <div className='box' key={product.id}>
                      <div className='img_box'>
                        <img src={product.image} alt={product.Name} />
                        <div className='icon'></div>
                      </div>
                      <div className='info'>
                        <h3>{product.Name}</h3>
                        <p>Rs {product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='banners'>
          <div className='container'>
            <div className='left_box'>
              <div className='box'>
                <img src='image/m3.jpg' alt='Banner' />
              </div>
              <div className='box'>
                <img src='image/m1.jpg' alt='Banner' />
              </div>
            </div>
            <div className='right_box'>
              <div className='top'>
                <img src='image/m2.jpg' alt='' />
                <img src='image/m5.jpg' alt='' />
              </div>
              <div className='bottom'>
                <img src='image/m4.jpg' alt='' />
              </div>
            </div>
          </div>
        </div>
        <div className='product_type'>
          <div className='container'>
            <div className='box'>
              <div className='header'>
                <h2>New Products</h2>
              </div>
              {newProduct.map((product) => (
                <div className='productbox' key={product.id}>
                  <div className='img-box'>
                    <img src={product.image} alt={product.Name} />
                  </div>
                  <div className='detail'>
                    <h3>{product.Name}</h3>
                    <p>Rs {product.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className='box'>
              <div className='header'>
                <h2>Featured Products</h2>
              </div>
              {featuredProduct.map((product) => (
                <div className='productbox' key={product.id}>
                  <div className='img-box'>
                    <img src={product.image} alt={product.Name} />
                  </div>
                  <div className='detail'>
                    <h3>{product.Name}</h3>
                    <p>Rs {product.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className='box'>
              <div className='header'>
                <h2>Top Products</h2>
              </div>
              {topProduct.map((product) => (
                <div className='productbox' key={product.id}>
                  <div className='img-box'>
                    <img src={product.image} alt={product.Name} />
                  </div>
                  <div className='detail'>
                    <h3>{product.Name}</h3>
                    <p>Rs {product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
