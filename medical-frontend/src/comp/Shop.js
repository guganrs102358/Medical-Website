import React, { useState, useEffect, useContext } from 'react';
import './Shop.css';
import { AiFillEye, AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const Shop = ({ shop, Filter, allcatefilter, addtocart }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [detail, setDetail] = useState({});
  const [shopProducts, setShopProducts] = useState([]);
  const [adminProducts, setAdminProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetching shop products
        const shopResponse = await axios.get('http://localhost:3001/shopproducts');
        setShopProducts(shopResponse.data);

        // Fetching admin products
        const adminResponse = await axios.get('http://localhost:3001/adminproducts');
        setAdminProducts(adminResponse.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Combine products and set as the default filtered products
    setFilteredProducts([...shopProducts, ...adminProducts]);
  }, [shopProducts, adminProducts]);

  const detailpage = (product) => {
    setDetail(product);
    setShowDetail(true);
  };

  const closedetail = () => {
    setShowDetail(false);
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      navigate('/login');
      alert('Please login.');
      return;
    }

    try {
      addtocart(product);
      await axios.post('http://localhost:3001/addtocart', {
        Name: product.Name,
        image: product.image,
        price: product.price,
        des: product.des,
        cat: product.cat
      });
    } catch (error) {
      console.error('Error adding product to shop:', error);
      alert('Failed to add product to shop');
    }
  };

  const handleCategoryFilter = (category) => {
    if (category === 'All') {
      // Show all products when 'All' is selected
      setFilteredProducts([...shopProducts, ...adminProducts]);
    } else {
      // Filter products based on the selected category
      const filtered = [...shopProducts, ...adminProducts].filter(
        (product) => product.cat.toLowerCase() === category.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <>
      {showDetail && (
        <div className='product_detail'>
          <button className='close_btn' onClick={closedetail}>
            <AiOutlineClose />
          </button>
          <div className='container'>
            <div className='img_box'>
              <img src={`http://localhost:3001/${detail.image}`} alt={detail.Name} />
            </div>
            <div className='info'>
              <h4># {detail.cat}</h4>
              <h2>{detail.Name}</h2>
              <p>{detail.des}</p>
              <h3>Rs {detail.price}</h3>
              <button onClick={() => handleAddToCart(detail)}>Add To Cart</button>
            </div>
          </div>
        </div>
      )}

      <div className='shop'>
        <div className='container'>
          <div className='left_box'>
            <div className='category'>
              <div className='header'>
                <h3>All Categories</h3>
              </div>
              <div className='box'>
                <ul>
                  <li onClick={() => handleCategoryFilter('All')}>All</li>
                  <li onClick={() => handleCategoryFilter('CIPLA')}>CIPLA</li>
                  <li onClick={() => handleCategoryFilter('mankind')}>Mankind</li>
                  <li onClick={() => handleCategoryFilter('orimis')}>Orimis</li>
                  <li onClick={() => handleCategoryFilter('sk')}>sk</li>
                  <li onClick={() => handleCategoryFilter('hello')}>hello</li>
                  <li onClick={() => handleCategoryFilter('First Aid Kit')}>First Aid Kit</li>
                </ul>
              </div>
            </div>
            <div className='banner'>
              <div className='img_box'>
                <img src='image/shop_left.jpg' alt='Banner' />
              </div>
            </div>
          </div>

          <div className='right_box'>
            <div className='banner'>
              <div className='img_box'>
                <img src='image/shop_top.jpeg' alt='Banner' />
              </div>
            </div>
            <div className='product_box'>
              <h2>Shop Products</h2>
              <div className='product_container'>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div className='box' key={product._id}>
                      <div className='img_box'>
                        <img src={`http://localhost:3001/${product.image}`} alt={product.Name} />
                        <div className='icon'>
                          <li onClick={() => detailpage(product)}>
                            <AiFillEye />
                          </li>
                        </div>
                      </div>
                      <div className='detail'>
                        <h3>{product.Name}</h3>
                        <p>Rs {product.price}</p>
                        <button onClick={() => handleAddToCart(product)}>Add To Cart</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No products available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
