const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserCart = require('../models/userCart');
const Product = require('../models/product');
const User = require('../models/user');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

module.exports = {

    readUserData(req, res){

    },
    //Need to be fixed........
    addToCart(req, res){
        const { userId ,id } = req.body;
        // const { id } = req.params;
        let productInCart = new UserCart({
            _id: userId,
            product:[{productId:id}]   
            // product.productId:
        });
        productInCart.save().then(data=>{
            res.status(200).json({success:true, data})
        })

    },
    //Need to be fixed........
    removeFromCart(req, res){
        const { id } = req.params;
        const { userId } = req.body;
        // UserCart.findById(userId).exec((err, data)=>{
        //     if(err) console.log("removeFromCart err-----------:",err)
        //     else
        //     data.product.splice(0,1)
        // });

        // UserCart.update(
        //     {$pull: {product: id}},
        //     {safe: true, upsert: true},
        //     function(err, doc) {
        //         if(err){
        //         console.log(err);
        //         }else{
        //         //do stuff
        //         }
        //     });

        // find by document id and update and pop or remove item in array
        users.findByIdAndUpdate(userId,
            {$pull: {product: id}},
            {safe: true, upsert: true},
            function(err, doc) {
                if(err){
                console.log(err);
                }else{
                //do stuff
                }
            });


        //   UserCart.save().then((data)=> {res.status(200).json({
        //       success:true,
        //       data
        //     })}).catch(err=>console.log(err))

    },
    register(req, res){
         // Form validation
        const { errors, isValid } = validateRegisterInput(req.body);
        // Check validation
            if (!isValid) {
            return res.status(400).json(errors);
            console.log('isValid bad: ',errors);      
            }
        User.findOne({ email: req.body.email }).then(user => {
            if (user) {
              return res.status(400).json({ email: "Email already exists" });
            console.log('findOne bad: ');
            
            } else {
              const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                address: req.body.address
              });
        // Hash password before saving in database
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  newUser.password = hash;
                  newUser
                    .save()
                    .then(user => res.status(200).json(user))
                    .catch(err => console.log(err));
                });
              });
            }
          }).catch(err=> console.log(err));
        },

    login(req, res){
        // console.log('Login: ',req)
            // Form validation
            const { errors, isValid } = validateLoginInput(req.body);
            // Check validation
            if (!isValid) {
                return res.status(400).json(errors);
            }
            const email = req.body.email;
            const password = req.body.password;
            // Find user by email
            User.findOne({ email }).then(user => {
                // Check if user exists
                if (!user) {
                return res.status(404).json({ emailnotfound: "Email not found" });
                }
            // Check password
                bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {
                    console.log("userID: ",user.id)
        
                    // User matched
                    // Create JWT Payload
                    const payload = {
                    id: user.id,
                    name: user.name,
                    userType: user.userType
                    };
            // Sign token
                    jwt.sign(
                    payload,
                    process.env.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                        success: true,
                        token: "Bearer " + token
                        });
                    }
                    );
                } else {
                    return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect" });
                }
                });
            });
    },
    logout(req, res){

    }
}