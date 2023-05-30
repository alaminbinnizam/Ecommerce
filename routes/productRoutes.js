import express from "express";
import {
    brainTreePaymentController,
    braintreeTokenController,
    createProductController,
    deleteProductController,
    getProductController,
    getSingleProductController,
    productCategoryController,
    productCountController,
    productFilterController,
    productListController,
    productPhotoController,
    relatedProductController,
    searchProductController,
    updateProductController
} from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authmiddleware.js";
import ExpressFormidable from "express-formidable";

const router = express.Router();

//routes
//create route
router.post('/create-product', requireSignIn, isAdmin, ExpressFormidable(), createProductController);

// updating route
router.put('/update-product/:pid', requireSignIn, isAdmin, ExpressFormidable(), updateProductController);


// get Product
router.get('/get-product', getProductController);

//single product
router.get('/get-product/:slug', getSingleProductController);

//get photo
router.get('/product-photo/:pid', productPhotoController);

//delete product
router.delete('/delete-product/:pid', deleteProductController);

//flter product
router.post('/product-filters', productFilterController );

//product count
router.get('/product-count', productCountController);

//product per page
router.get('/product-list/:page', productListController);

//search product
router.get('/search/:keyword', searchProductController);

//simillar product
router.get('/related-product/:pid/:cid', relatedProductController);

//category wise product
router.get('/product-category/:slug', productCategoryController)

//payment routes
//token
router.get('/braintree/token', braintreeTokenController);

//payments
router.post('/braintree/payment', requireSignIn, brainTreePaymentController)


export default router