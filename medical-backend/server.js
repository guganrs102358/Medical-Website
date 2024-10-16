const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/MedicalWebsite', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});

// Define schemas and models

// User schema with role field
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    role: { type: String, default: 'user' } // Role field: 'user' or 'admin'
});

const User = mongoose.model('User', userSchema);

// Contact schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    date: { type: Date, default: Date.now },
});

const Contact = mongoose.model('Contact', contactSchema);

// Product schema
const productSchema = new mongoose.Schema({
    productId: { type: Number, unique: true, required: true },
    Name: String,
    image: String,
    price: Number,
    des: String,
    cat: String
});


const Product = mongoose.model('Product', productSchema);

// Order schema
const orderSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    address: String,
    transactionId: String,
    paymentScreenshot: String,
    productName: String,
    price: {
        type: Number,
        get: v => parseFloat(v).toFixed(2), // Convert to 2 decimal places on retrieval
        set: v => parseFloat(v).toFixed(2), // Ensure 2 decimal places on save
        required: true
    },
    purchaseDate: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);


// Cart schema
const cartSchema = new mongoose.Schema({
    productId: String,
    Name: String,
    image: String,
    price: Number,
    des: String,
    cat: String
});

const Cart = mongoose.model('Cart', cartSchema);

// Routes
// Order COD schema
const orderCODSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    address: String,
    productName: String,
    price: {
        type: Number,
        get: v => parseFloat(v).toFixed(2), // Convert to 2 decimal places on retrieval
        set: v => parseFloat(v).toFixed(2), // Ensure 2 decimal places on save
        required: true
    },
    purchaseDate: { type: Date, default: Date.now }
});

const OrderCOD = mongoose.model('OrderCOD', orderCODSchema);


// User registration
app.post('/register', async (req, res) => {
    console.log('Request received at /register:', req.body);
    const { name, email, phone, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, phone, password: hashedPassword, role });
        await newUser.save();
        res.status(200).json({ username: name, role });
    } catch (err) {
        console.error('Error saving user:', err);
        res.status(400).send('Error registering user: ' + err.message);
    }
});

// User login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid email or password');
        }

        res.status(200).json({ username: user.name, role: user.role, userId: user._id });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Login failed');
    }
});

// Contact form submission
app.post('/contact', async (req, res) => {
    console.log('Request received at /contact:', req.body);
    const { Name, email, subject, Message } = req.body;

    try {
        const newContact = new Contact({ 
            name: Name,
            email: email,
            subject: subject,
            message: Message 
        });
        await newContact.save();
        res.status(200).json({ message: 'Message received' });
    } catch (err) {
        console.error('Error saving contact message:', err);
        res.status(400).send('Error saving contact message: ' + err.message);
    }
});



// Handle cash on delivery orders
app.post('/addordercod', async (req, res) => {
    const { name, email, phoneNumber, address, totalAmount } = req.body;
    const products = JSON.parse(req.body.products); // Assuming products is sent as a JSON string

    try {
        // Create a new OrderCOD document and save it to the database
        const newOrderCOD = new OrderCOD({
            name,
            email,
            phone: phoneNumber,
            address,
            productName: products.map(item => item.Name).join(', '),  // Combine product names
            price: totalAmount,  // Store total amount
        });

        await newOrderCOD.save();
        res.status(200).json({ message: 'Cash on delivery order placed successfully' });
    } catch (err) {
        console.error('Error placing cash on delivery order:', err);
        res.status(400).send('Error placing cash on delivery order: ' + err.message);
    }
});




app.post('/addorder', upload.single('paymentScreenshot'), async (req, res) => {
    const { name, email, phoneNumber, address, transactionId, totalAmount } = req.body;
    const paymentScreenshot = req.file ? req.file.path : null;
    const products = JSON.parse(req.body.products);

    try {
        const newOrder = new Order({
            name,
            email,
            phone: phoneNumber, 
            address,
            transactionId,
            paymentScreenshot,
            productName: products.map(item => item.Name).join(', '),  
            price: totalAmount,  
        });
        await newOrder.save();
        res.status(200).json({ message: 'Order placed successfully' });
    } catch (err) {
        console.error('Error placing order:', err);
        res.status(400).send('Error placing order: ' + err.message);
    }
});


// Get all products for shop
app.get('/shopproducts', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (err) {
        console.error('Error retrieving shop products:', err);
        res.status(500).send('Error retrieving shop products');
    }
});

// Get all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (err) {
        console.error('Error retrieving products:', err);
        res.status(500).send('Error retrieving products');
    }
});


app.get('/orders_cod', async (req, res) => {
    try {
        const orders = await OrderCOD.find(); // Replace OrderCOD with your model name
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// Get all orders
app.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find({});
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).send('Error retrieving orders');
    }
});

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        console.error('Error retrieving users:', err);
        res.status(500).send('Error retrieving users');
    }
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (user.role === 'admin') {
            return res.status(403).send('Cannot delete an admin user');
        }

        await User.findByIdAndDelete(userId);
        res.status(200).send('User deleted successfully');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Error deleting user');
    }
});

// DELETE endpoint for deleting a product
app.delete('/shopproducts/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a user's role
app.put('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { role } = req.body;

        if (role !== 'user' && role !== 'admin') {
            return res.status(400).send('Invalid role');
        }

        const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).json(user);
    } catch (err) {
        console.error('Error updating user role:', err);
        res.status(500).send('Error updating user role');
    }
});

// Add product to cart
app.post('/addtocart', async (req, res) => {
    const { productId, Name, image, price, des, cat } = req.body;

    try {
        const newCartItem = new Cart({ productId, Name, image, price, des, cat });
        await newCartItem.save();
        res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (err) {
        console.error('Error adding product to cart:', err);
        res.status(400).send('Error adding product to cart: ' + err.message);
    }
});

// Add a new product
app.post('/addproduct', upload.single('image'), async (req, res) => {
    const { productId, Name, price, des, cat } = req.body;
    const image = req.file ? req.file.path : null;

    try {
        const newProduct = new Product({
            productId: Number(productId), // Convert to number
            Name,
            image,
            price,
            des,
            cat
        });
        await newProduct.save();
        res.status(200).json({ message: 'Product added successfully' });
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(400).send('Error adding product: ' + err.message);
    }
});

// Serve static files from the "uploads" directory
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
