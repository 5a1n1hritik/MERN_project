const express = require('express');
const ProductModel = require('../models/ProductModel');
const router = express.Router();



router.post('/', (req, res)=>{
    try{
        // res.json(ProductModel)
        console.log(req.body);
        // res.send('hello')
        // const product = ProductModel(req.body);
        // product.save()
        // res.send(req.body)
        const product = ProductModel.create(req.body)
        res.status(201).json({
            success:true,
            product
        })
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
})

// Get All Product 
// router.get('/products', async (req, res)=>{
//     // console.log(req.body);
//     const products = await ProductModel.find();
//     res.status(201).json({
//         success:true,
//         products
//     })
// })
router.get('/products', async (req, res) => {
    try {
      // Retrieve query parameters for search, filter, and pagination
      const { search = '', filter = {}, page = 1, limit = 10, category, minPrice, maxPrice, } = req.query;
  
      // Construct the MongoDB query, integrating search and filter conditions
      let query = {};
      if (search) {
        query = {
          $or: [
            { name: { $regex: search, $options: 'i' } }, // Case-insensitive search
            { description: { $regex: search, $options: 'i' } },
          ],
        };
      }
      Object.keys(filter).forEach((key) => {
        query[key] = filter[key];
      });
      if (category) {
        query.category = category;
      }
      if (minPrice && maxPrice) {
        query.price = { $gte: minPrice, $lte: maxPrice };
      }
  
      // Apply pagination using Mongoose's skip() and limit()
      const products = await ProductModel.find(query)
        .skip((page - 1) * limit)
        .limit(limit);
  
      // Calculate total product count for pagination information
      const totalCount = await ProductModel.countDocuments(query);
  
      res.status(200).json({
        success: true,
        products,
        totalCount,
        currentPage: page,
        limit,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  });








// Update a product: PUT "/api/products/:id"
router.put('/products/:id', async (req, res) => {
    try {
        let product = await ProductModel.findById(req.params.id);

        if(!product){
            return res.status(500).json({
                success: false,
                message: "Product not found"
            })
        }

        product = await ProductModel.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators: true,
            useFindAndModify:false
        });

        res.status(200).json({
            success:true,
            product
        })
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
});

// Delete Product
router.delete('/Delete/:id', async (req,res) => {
    try {
        const product = await ProductModel.findById(req.params.id);

        if(!product){
            return res.status(500).json({
                success: false,
                message: "Product not found"
            })
        }

        await ProductModel.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success:true,
            message: "Product Delete Successfully",
            product
        })
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
})

module.exports = router