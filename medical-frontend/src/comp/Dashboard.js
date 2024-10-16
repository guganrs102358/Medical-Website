import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; 
import * as XLSX from 'xlsx'; 
import { saveAs } from 'file-saver';
import { FaTrashAlt } from 'react-icons/fa';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType } from 'docx'; 

import './Dashboard.css';

function Dashboard() {
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [orderType, setOrderType] = useState('online');
    const [searchQuery, setSearchQuery] = useState('');
    const [productName, setProductName] = useState('');
    const [productImage, setProductImage] = useState(null);
    const [productPrice, setProductPrice] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productId, setProductId] = useState('');
    const [orderSearchQuery, setOrderSearchQuery] = useState(''); 

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [view, setView] = useState('users');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userResponse, productResponse] = await Promise.all([
                    axios.get('http://localhost:3001/users'),
                    axios.get('http://localhost:3001/shopproducts'),
                ]);
                setUsers(userResponse.data);
                setProducts(productResponse.data);
            } catch (err) {
                setError(err.message);
            }
        };

        setIsAdmin(true);
        fetchData();
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const orderResponse = orderType === 'online'
                    ? await axios.get('http://localhost:3001/orders')
                    : await axios.get('http://localhost:3001/orders_cod');
                
                setOrders(orderResponse.data);
            } catch (err) {
                setError(err.message);
            }
        };

        if (view === 'orders') {
            fetchOrders();
        }
    }, [orderType, view]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await axios.put(`http://localhost:3001/users/${userId}`, { role: newRole });
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === userId ? { ...user, role: newRole } : user
                )
            );
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:3001/users/${userId}`);
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`http://localhost:3001/shopproducts/${productId}`);
            setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
        } catch (err) {
            setError(err.message);
        }
    };
    
    const handleProductSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('productId', Number(productId));
        formData.append('Name', productName);
        formData.append('image', productImage);
        formData.append('price', productPrice);
        formData.append('des', productDescription);
        formData.append('cat', productCategory);

        try {
            await axios.post('http://localhost:3001/addproduct', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const productResponse = await axios.get('http://localhost:3001/shopproducts');
            setProducts(productResponse.data);
            setProductName('');
            setProductImage(null);
            setProductPrice('');
            setProductDescription('');
            setProductCategory('');
            setProductId('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleImageChange = (event) => {
        setProductImage(event.target.files[0]);
    };

    // Function to generate PDF
const downloadPDF = () => {
    const filteredOrders = orders.filter(order => {
        const purchaseDate = new Date(order.purchaseDate);
        return purchaseDate >= new Date(startDate) && purchaseDate <= new Date(endDate);
    });

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = pageWidth / 2; 

    // Title Section
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold'); 
    doc.text('Annoor Medicals', centerX, 10, { align: 'center' }); 
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal'); 
    doc.text('Kangayam Road, Nathakadaiyur', centerX, 15, { align: 'center' });
    doc.text('Tirupur District - 638108', centerX, 20, { align: 'center' });
    doc.text('Contact: 9488089292', centerX, 25, { align: 'center' });

    // Order Details Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold'); 
    doc.text(orderType === 'online' ? 'Online Order Details' : 'Cash on Delivery Details', centerX, 35, { align: 'center' });

    // Table Section
    const headers = ['Name', 'Email', 'Phone', 'Address'];
    if (orderType === 'online') headers.push('Transaction ID');
    headers.push('Product Name', 'Purchase Date');

    const data = filteredOrders.map(order => {
        const row = [
            order.name,
            order.email,
            order.phone || 'N/A',
            order.address || 'N/A',
        ];
        if (orderType === 'online') row.push(order.transactionId || 'N/A');
        row.push(order.productName);
        row.push(new Date(order.purchaseDate).toLocaleDateString() || 'N/A');
        return row;
    });

    doc.autoTable({
        head: [headers],
        body: data,
        startY: 40,
        theme: 'grid',
        styles: { overflow: 'linebreak', fontSize: 10 }
    });

    doc.save(`${orderType === 'online' ? 'Online_Orders' : 'Cash_on_Delivery_Orders'}.pdf`);
};


 // Function to generate Excel
const downloadXLSX = () => {
    const filteredOrders = orders.filter(order => {
        const purchaseDate = new Date(order.purchaseDate);
        return purchaseDate >= new Date(startDate) && purchaseDate <= new Date(endDate);
    });

    const wsData = filteredOrders.map(order => {
        const row = {
            Name: order.name,
            Email: order.email,
            Phone: order.phone || 'N/A',
            Address: order.address || 'N/A',
            'Product Name': order.productName,
            'Purchase Date': new Date(order.purchaseDate).toLocaleDateString() || 'N/A'
        };

        // Only add the Transaction ID if the order type is 'online'
        if (orderType === 'online') {
            row['Transaction ID'] = order.transactionId || 'N/A';
        }

        return row;
    });

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, `${orderType === 'online' ? 'Online_Orders' : 'Cash_on_Delivery_Orders'}.xlsx`);
};


const downloadWord = async () => {
    const filteredOrders = orders.filter(order => {
        const purchaseDate = new Date(order.purchaseDate);
        return purchaseDate >= new Date(startDate) && purchaseDate <= new Date(endDate);
    });

    const headerCells = [
        new TableCell({ children: [new Paragraph('Name')] }),
        new TableCell({ children: [new Paragraph('Email')] }),
        new TableCell({ children: [new Paragraph('Phone')] }),
        new TableCell({ children: [new Paragraph('Address')] }),
    ];

    if (orderType === 'online') {
        headerCells.push(new TableCell({ children: [new Paragraph('Transaction ID')] }));
    }

    headerCells.push(new TableCell({ children: [new Paragraph('Product Name')] }));
    headerCells.push(new TableCell({ children: [new Paragraph('Purchase Date')] }));

    const tableRows = filteredOrders.map(order => {
        const rowCells = [
            new TableCell({ children: [new Paragraph(order.name)] }),
            new TableCell({ children: [new Paragraph(order.email)] }),
            new TableCell({ children: [new Paragraph(order.phone || 'N/A')] }),
            new TableCell({ children: [new Paragraph(order.address || 'N/A')] }),
        ];

        if (orderType === 'online') {
            rowCells.push(new TableCell({ children: [new Paragraph(order.transactionId || 'N/A')] }));
        }

        rowCells.push(new TableCell({ children: [new Paragraph(order.productName)] }));
        rowCells.push(new TableCell({ children: [new Paragraph(new Date(order.purchaseDate).toLocaleDateString() || 'N/A')] }));

        return new TableRow({ children: rowCells });
    });

    const table = new Table({
        rows: [
            new TableRow({ children: headerCells }), // Add header row
            ...tableRows
        ],
        width: { size: 100, type: WidthType.PERCENTAGE }
    });

    const doc = new Document({
        sections: [{
            children: [
                new Paragraph({ text: 'Annoor Medicals', bold: true }),
                new Paragraph('Kangayam Road, Nathakadaiyur'),
                new Paragraph('Tirupur District - 638108'),
                new Paragraph('Contact: 9488089292'),
                new Paragraph({ text: orderType === 'online' ? 'Online Order Details' : 'Cash on Delivery Details', spacing: { after: 200 } }),
                table
            ]
        }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${orderType === 'online' ? 'Online_Orders' : 'Cash_on_Delivery_Orders'}.docx`);
};

const filteredUsers = users.filter(user =>
    user.phone && user.phone.includes(searchQuery)
);

if (error) {
    return <div>Error: {error}</div>;
}
    return (
        <div className="dashboard">
            <div className="dashboard-menu">
                <button onClick={() => setView('users')}>Users</button>
                <button onClick={() => setView('products')}>Products</button>
                <button onClick={() => setView('orders')}>Orders</button>
            </div>

            {view === 'users' && (
                <div className="user-management">
                    <h2>User Management</h2>
                    {isAdmin && (
                        <>
                           <div class="search-container">
    <label for="phoneSearch" class="search-label">Enter Mobile Number</label>
    <input
        id="phoneSearch"
        type="text"
        placeholder="Search by phone number"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        class="search-input"
    />
</div>

                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user._id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone}</td>
                                            <td>
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button onClick={() => handleDeleteUser(user._id)}>
                                                    <FaTrashAlt />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            )}

{view === 'products' && (
    <div className="product-management">
        <h2>Product Management</h2>
        <form className="product-form" onSubmit={handleProductSubmit}>
            <label>
                Product ID:
                <input
                    type="number"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    required
                />
            </label>
            <label>
                Name:
                <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                />
            </label>
            <label>
                Image:
                <input
                    type="file"
                    onChange={handleImageChange}
                    required
                />
            </label>
            <label>
                Price:
                <input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    required
                />
            </label>
            <label>
                Description:
                <textarea
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    required
                />
            </label>
            <label>
                Category:
                <input
                    type="text"
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    required
                />
            </label>
            <button type="submit">Add Product</button>
        </form>
        <table>
            <thead>
                <tr>
                    <th>Product ID</th>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Price</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => (
                    <tr key={product._id}>
                        <td>{product.productId}</td>
                        <td>{product.Name}</td>
                        <td>
                        <img src={`http://localhost:3001/${product.image}`} alt={product.Name} width="100" />
                        </td>
                        <td>{product.price}</td>
                        <td>{product.des}</td>
                        <td>{product.cat}</td>
                        <td>
                            <button onClick={() => handleDeleteProduct(product._id)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)}
    {view === 'orders' && (
    <div className="order-table">
        <h2>Orders Table</h2>
        <div class="search-container">
    <label for="phoneSearch" class="search-label">Enter Mobile Number</label>
    <input
        id="phoneSearch"
        type="text"
        placeholder="Search"
        value={orderSearchQuery}
        onChange={(e) => setOrderSearchQuery(e.target.value)}
        class="search-input"
    />
</div>  
        <div>
            <div className="radio-buttons">
                <label className="radio-button"> 
                    <input
                        type="radio"
                        value="online"
                        checked={orderType === 'online'}
                        onChange={() => setOrderType('online')}
                    />
                    Online Orders
                </label>
                <label className="radio-button">
                    <input
                        type="radio"
                        value="cod"
                        checked={orderType === 'cod'}
                        onChange={() => setOrderType('cod')}
                    />
                    Cash on Delivery
                </label>
            </div>
            <div className="date-range">
                <label className="date-label">
                    Start Date:
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </label>
                <label className="date-label">
                    End Date:
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </label>
            </div>
            <button className="download-button" onClick={downloadPDF}>Download PDF</button>
            <button className="download-button" onClick={downloadXLSX}>Download Excel</button>
            <button className="download-button" onClick={downloadWord}>Download Word</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    {orderType === 'online' && (
                    <>
                    <th>Transaction ID</th>
                    <th>Payment Screenshot</th>
                    </>
                    )}
                    <th>Product Name</th>
                    <th>Purchase Date</th>
                </tr>
            </thead>
            <tbody>
                {orders
                    .filter((order) =>
                        order.phone && order.phone.includes(orderSearchQuery) 
                    )
                    .map((order) => (
                        <tr key={order._id}>
                            <td>{order.name}</td>
                            <td>{order.email}</td>
                            <td>{order.phone || 'N/A'}</td>
                            <td>{order.address || 'N/A'}</td>
                            {orderType === 'online' && (
                                            <>
                                                <td>{order.transactionId || 'N/A'}</td>
                                                <td>
                                                    {order.paymentScreenshot ? (
                                                        <img
                                                            src={`http://localhost:3001/${order.paymentScreenshot}`}
                                                            alt="Payment Screenshot"
                                                            width="100"
                                                        />
                                                    ) : 'N/A'}
                                                </td>
                                            </>
                                        )}
                            <td>{order.productName}</td>
                            <td>{new Date(order.purchaseDate).toLocaleDateString() || 'N/A'}</td>
                        </tr>
                    ))}
            </tbody>
        </table>
    </div>
)}
        </div>
    );
}

export default Dashboard;