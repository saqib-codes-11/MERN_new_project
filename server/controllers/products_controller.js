const Product = require('../models/product');

module.exports = {
    
    readAllProducts(req, res){

        Product.find({}).exec((err, products)=>{
            if(err){
                console.log('All products err--------',err);
            }
            res.status(200).send(products);
        })

    },
    readProduct(req, res){

        const { id } = req.params;
        Product.findById(id).exec((err, product) => {
            if(err){
                console.log('Product err----------',err);
            }
            res.status(200).send({product});
        })

    }
}