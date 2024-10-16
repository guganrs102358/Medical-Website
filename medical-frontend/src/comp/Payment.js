import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Payment.css';

const GST_RATE = 0.18; // Example GST rate of 18%

const Payment = () => {
  const location = useLocation();
  const { cart } = location.state || { cart: [] }; // Fallback to empty cart if no state is passed

  const [paymentMethod, setPaymentMethod] = useState('online'); // Default to 'online'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    transactionId: '',
    paymentScreenshot: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      paymentScreenshot: e.target.files[0],
    });
  };

  const totalAmount = cart.reduce((price, item) => price + item.qty * item.price, 0);
  const gstAmount = totalAmount * GST_RATE;
  const totalAmountWithGST = totalAmount + gstAmount;

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phonePattern = /^[0-9]{10}$/; // Adjust this pattern based on your requirements
    return phonePattern.test(phoneNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email and phone number
    if (!validateEmail(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!validatePhoneNumber(formData.phoneNumber)) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }

    if (paymentMethod === 'online') {
      // Online payment form data
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('products', JSON.stringify(cart));
      formDataToSend.append('totalAmount', totalAmountWithGST);
      formDataToSend.append('transactionId', formData.transactionId);
      formDataToSend.append('paymentScreenshot', formData.paymentScreenshot);

      try {
        const response = await fetch('http://localhost:3001/addorder', {
          method: 'POST',
          body: formDataToSend,
        });

        if (response.ok) {
          const whatsappUrl = `https://wa.me/9361386008?text=
                Name: ${formData.name}%0A
                Email: ${formData.email}%0A
                Phone Number: ${formData.phoneNumber}%0A
                Address: ${formData.address}%0A
                Products: ${cart.map(item => `${item.Name} (Qty: ${item.qty}, Price: Rs ${item.price.toFixed(2)})`).join(', ')}%0A
                Total Amount: Rs ${totalAmountWithGST.toFixed(2)}%0A
                Transaction ID: ${formData.transactionId}%0A`;

          window.open(whatsappUrl, '_blank');
        } else {
          console.error('Failed to place online order:', response.statusText);
        }
      } catch (err) {
        console.error('Error placing online order:', err);
      }
    } else if (paymentMethod === 'cash') {
      // Cash on Delivery form data
      const codData = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        products: JSON.stringify(cart),
        totalAmount: totalAmountWithGST,
      };

      try {
        const response = await fetch('http://localhost:3001/addordercod', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(codData),
        });

        if (response.ok) {
          const whatsappUrl = `https://wa.me/9361386008?text=
                Name: ${formData.name}%0A
                Email: ${formData.email}%0A
                Phone Number: ${formData.phoneNumber}%0A
                Address: ${formData.address}%0A
                Products: ${cart.map(item => `${item.Name} (Qty: ${item.qty}, Price: Rs ${item.price.toFixed(2)})`).join(', ')}%0A
                Total Amount: Rs ${totalAmountWithGST.toFixed(2)}%0A
                Payment Method: Cash on Delivery`;

          window.open(whatsappUrl, '_blank');
        } else {
          console.error('Failed to place COD order:', response.statusText);
        }
      } catch (err) {
        console.error('Error placing COD order:', err);
      }
    }
  };

  return (
    <div className='payment'>
      <h2>Payment Page</h2>
      
      <div>
        <label>
          <input 
            type='radio' 
            value='online' 
            checked={paymentMethod === 'online'} 
            onChange={() => setPaymentMethod('online')} 
          />
          Online Payment
        </label>
        <label>
          <input 
            type='radio' 
            value='cash' 
            checked={paymentMethod === 'cash'} 
            onChange={() => setPaymentMethod('cash')} 
          />
          Cash on Delivery
        </label>
      </div>

      {paymentMethod === 'online' ? (
        <form onSubmit={handleSubmit}>
          {/* Input fields for online payment */}
          <div>
            <label>Name</label>
            <input type='text' name='name' value={formData.name} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Email</label>
            <input type='email' name='email' value={formData.email} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Phone Number</label>
            <input type='tel' name='phoneNumber' value={formData.phoneNumber} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Address</label>
            <input type='text' name='address' value={formData.address} onChange={handleInputChange} required />
          </div>
          <div>
            <h4>Product Summary:</h4>
            <table className='product-summary-table'>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Price (Rs)</th>
                  <th>Quantity</th>
                  <th>Subtotal (Rs)</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.productId}>
                    <td>{item.Name}</td>
                    <td>{item.price.toFixed(2)}</td>
                    <td>{item.qty}</td>
                    <td>{(item.qty * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h4>GST (18%): Rs {gstAmount.toFixed(2)}</h4>
            
            <h3>Total: Rs {totalAmountWithGST.toFixed(2)}</h3>
            
          </div>
          <div>
            <label>Transaction ID</label>
            <input type='text' name='transactionId' value={formData.transactionId} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Payment Screenshot</label>
            <input type='file' name='paymentScreenshot' accept='image/*' onChange={handleFileChange} required />
          </div>
          <div>
            <h4>Scan to Pay:</h4>
            {/* Static QR Code Image */}
            <img src="image/qr.jpg" alt="QR Code" />
          </div>
          <button type='submit'>Submit</button>
        </form>
      ) : paymentMethod === 'cash' ? (
        <div>
          <form onSubmit={handleSubmit}>
            {/* Input fields for COD */}
            <div>
              <label>Name</label>
              <input type='text' name='name' value={formData.name} onChange={handleInputChange} required />
            </div>
            <div>
              <label>Email</label>
              <input type='email' name='email' value={formData.email} onChange={handleInputChange} required />
            </div>
            <div>
              <label>Phone Number</label>
              <input type='tel' name='phoneNumber' value={formData.phoneNumber} onChange={handleInputChange} required />
            </div>
            <div>
              <label>Address</label>
              <input type='text' name='address' value={formData.address} onChange={handleInputChange} required />
            </div>
            <div>
              <h4>Product Summary:</h4>
              <table className='product-summary-table'>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Price (Rs)</th>
                    <th>Quantity</th>
                    <th>Subtotal (Rs)</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.productId}>
                      <td>{item.Name}</td>
                      <td>{item.price.toFixed(2)}</td>
                      <td>{item.qty}</td>
                      <td>{(item.qty * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h4>GST (18%): Rs {gstAmount.toFixed(2)}</h4>
              
              <h3>Total: Rs {totalAmountWithGST.toFixed(2)}</h3>
              
            </div>
            <button type='submit'>Submit</button>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default Payment;
