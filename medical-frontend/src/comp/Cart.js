import React from 'react';
import './Cart.css';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';

const Cart = ({ cart, setCart }) => {
  const navigate = useNavigate();

  const incqty = (product) => {
    setCart(
      cart.map((curElm) =>
        curElm.productId === product.productId
          ? { ...curElm, qty: curElm.qty + 1 }
          : curElm
      )
    );
  };

  const decqty = (product) => {
    if (product.qty > 1) {
      setCart(
        cart.map((curElm) =>
          curElm.productId === product.productId
            ? { ...curElm, qty: curElm.qty - 1 }
            : curElm
        )
      );
    } else {
      setCart(cart.filter((curElm) => curElm.productId !== product.productId));
    }
  };

  const removeproduct = (product) => {
    if (product.qty > 1) {
      setCart(
        cart.map((curElm) =>
          curElm.productId === product.productId
            ? { ...curElm, qty: curElm.qty - 1 }
            : curElm
        )
      );
    } else {
      setCart(cart.filter((curElm) => curElm.productId !== product.productId));
    }
  };

  const total = cart.reduce(
    (price, item) => price + item.qty * item.price,
    0
  ).toFixed(2);

  const handleCheckout = () => {
    navigate('/payment', { state: { cart } });
  };

  return (
    <div className='cart'>
      {cart.length === 0 && (
        <div className='empty_cart'>
          <h2>Your Shopping cart is empty</h2>
          <Link to='/shop'>
            <button>Shop Now</button>
          </Link>
        </div>
      )}
      <div className='container'>
        {cart.map((curElm) => (
          <div className='box' key={curElm.productId}>
            <div className='img_box'>
              <img src={`http://localhost:3001/${curElm.image}`} alt={curElm.Name} />
            </div>
            <div className='detail'>
              <div className='info'>
                <h4>{curElm.cat}</h4>
                <h3>{curElm.Name}</h3>
                <p>Price: Rs {curElm.price}</p>
                <p>Total: Rs {(curElm.price * curElm.qty).toFixed(2)}</p>
              </div>
              <div className='quantity'>
                <button onClick={() => incqty(curElm)}>+</button>
                <input type='number' value={curElm.qty} readOnly />
                <button onClick={() => decqty(curElm)}>-</button>
              </div>
              <div className='icon'>
                <AiOutlineClose onClick={() => removeproduct(curElm)} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='bottom'>
        {cart.length > 0 && (
          <>
            <div className='Total'>
              <h4>Sub Total: Rs {total}</h4>
            </div>
            <button onClick={handleCheckout}>Buy</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
