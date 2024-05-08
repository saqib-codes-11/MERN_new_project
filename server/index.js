require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const userController = require('./controllers/user_controller');
const adminController = require('./controllers/admin_controller');
const productsController = require('./controllers/products_controller');
const PORT = process.env.PORT || 5000;

app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
app.use(bodyParser.json());
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true},(err)=>{
    if(err){
        console.log('Database Connection Err-------------:',err);
    }
    else
    console.log('Database Connected-------------');
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie: {
        maxAge: 1000*60*60*24*17
    }
}));

app.use(cors())

setTimeout(()=>{
    app.get('/api/user-data', userController.readUserData);
    //Add a item to cart.
    app.post('/api/user-data/cart', userController.addToCart);
    //Remove a item from the cart.
    // Use request parameter to remove item from cart since you are looking a specific item in cart.
    app.delete('/api/user-data/cart/:id', userController.removeFromCart);
    //User Register to place order
    app.post('/api/register', userController.register)
    //When user login
    app.post('/api/login', userController.login);
    //When the user logouts
    app.post('/api/logout', userController.logout);
    //Products Endpoints
    //Getting all the products
    app.get('/api/products', productsController.readAllProducts);
    //Getting a specified product
    //Use a request parameter, since retrieving a specified product..
    app.get('/api/products/:id', productsController.readProduct);
    //Admin Endpoints
    //Gets the admin users.
    app.get('/api/users', adminController.getAdminUsers);
    //When a admin creates a product. No need for request parameter in this case. Since we are inserting data to database.
    app.post('/api/products', adminController.createProduct);
    //When a admin update a current product. Need request parameter since updating a specific product based on  the id.
    app.put('/api/products/:id', adminController.updateProduct);
    //When a admin deletes a product, need an id to specify a product to delete.
    app.delete('/api/products/:id', adminController.deleteProduct);

},200);

app.listen(PORT,()=>{console.log('Server running on Localhost:',PORT)});
