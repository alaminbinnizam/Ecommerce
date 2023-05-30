import slugify from "slugify";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js"
import fs from 'fs';
import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import dotenv from 'dotenv'
dotenv.config()

//payment getway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is required' });

            case !description:
                return res.status(500).send({ error: 'Description is required' });

            case !price:
                return res.status(500).send({ error: 'Price is required' });

            case !category:
                return res.status(500).send({ error: 'Category is required' });

            case !quantity:
                return res.status(500).send({ error: 'Quantity is required' });

            case !photo && photo.size > 1000000:
                return res.status(500).send({ error: 'Photo is  and should be less then 1 megabyte' });
        }

        const products = new productModel({ ...req.fields, slug: slugify(name) });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }

        await products.save();

        res.status(201).send({
            success: true,
            message: 'Product Created Successfully',
            products
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in creating product',
            error
        })
    }
}

//get all product controller
export const getProductController = async (req, res) => {
    try {
        const products = await productModel
            .find({})
            .populate('category')
            .select("-photo")
            .limit(12)
            .sort({ createdAt: -1 });
        res.send({
            success: true,
            totalCount: products.length,
            message: 'All Products ',
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in getting  product',
            error
        })
    }
}

//get single product controller

export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel
            .findOne({ slug: req.params.slug })
            .select('-photo')
            .populate('category');
        res.status(200).send({
            success: true,
            message: 'Single product fetched',
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in getting single product',
            error
        })
    }
}

//get product photo controller

export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
            res.set('content-type', product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in getting product photo',
            error
        })
    }
}

//deleting product controller

export const deleteProductController = async (req, res) => {
    try {
        const product = await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success: true,
            message: 'Product deleted succesfully',
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in deleting product',
            error
        })
    }
}



export const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } =
            req.fields;
        const { photo } = req.files;
        //alidation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
                return res
                    .status(500)
                    .send({ error: "photo is Required and should be less then 1mb" });
        }

        const products = await productModel.findByIdAndUpdate(
            req.params.pid,
            { ...req.fields, slug: slugify(name) },
            { new: true }
        );
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Updated Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in Updte product",
        });
    }
};

// filters controller
export const productFilterController = async (req, res) => {
    try {
        const { checked, radio } = req.body
        let args = {}
        if (checked.length > 0) args.category = checked
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }
        const products = await productModel.find(args)
        res.status(200).send({
            success: true,
            message: 'Product filtered successfully',
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error while filtering products',
            error
        })

    }
}

//product count controller
export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            message: 'Product Fetching Successfully',
            total
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error while fetching product',
            error
        })
    }
}

//product list controller
export const productListController = async (req, res) => {
    try {
        const perPage = 6
        const page = req.params.page ? req.params.page : 1
        const products = await productModel.find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 })

        res.status(200).send({
            success: true,
            message: 'Single Product fetched Successfully',
            products
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error in single page',
            error
        })
    }
}

//search product
export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params
        const results = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }).select("-photo")
        res.json(results)
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error in searching product',
            error
        })
    }
}

export const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params
        const products = await productModel.find({
            category: cid,
            _id: { $ne: pid }
        }).select("-photo").limit(3).populate("category")

        res.status(200).send({
            success: true,
            message: 'Similar product fetched successfully',
            products
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error in fetching realted products',
            error
        })
    }
}

//product category by single category

export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug })
        const products = await productModel.find({ category }).populate('category')
        res.status(200).send({
            success: true,
            message: 'Product fetched successfully by category',
            category,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error while getting product by category',
            error
        })
    }
}

// // payment getway api token
// export const braintreeTokenController = async (req, res) => {
//     try {
//         gateway.clientToken.generate({}, function (err, response) {
//             if (err) {
//                 res.status(500).send(err)
//             } else {
//                 res.send(response)
//             }
//         })
//     } catch (error) {
//         console.log(error);
//     }
// }

// // payment
// export const brainTreePaymentController = async (req, res) => {
//     try {
//         const { cart, nonce } = req.body;
//         let total = 0;
//         cart?.map((i) => ( total += i.price ));
//         let newTransaction = gateway.transaction.sale({
//             amount: total,
//             paymentMethodNonce: nonce,
//             options: {
//                 submitForSettlement: true
//             }
//         },
//             function (error, result) {
//                 if (result) {
//                     const order = new orderModel({
//                         products: cart,
//                         payment: result,
//                         buyer: req.user._id
//                     }).save()
//                     res.json({ ok: true})
//                 }else{
//                     res.status(500).send(error)
//                 }
//             }
//         )
//     } catch (error) {
//         console.log(error);
//     }
// }
export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(response);
            }
        });
    } catch (error) {
        console.log(error);
    }
};

//payment
export const brainTreePaymentController = async (req, res) => {
    try {
        const { nonce, cart } = req.body;
        let total = 0;
        cart.map((i) => (
            total += i.price
        ));
        let newTransaction = gateway.transaction.sale(
            {
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                },
            },
            function (error, result) {
                if (result) {
                    const order = new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save();
                    res.json({ ok: true });
                } else {
                    res.status(500).send(error);
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
};