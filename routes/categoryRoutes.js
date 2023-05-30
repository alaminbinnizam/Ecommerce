import express from "express";
import {
    categoryController,
    createCategoryController,
    deleteCategoryController,
    singleCategoryController,
    updateCategoryController
} from "../controllers/categoryController.js";
import { requireSignIn, isAdmin } from './../middlewares/authmiddleware.js'

const router = express.Router()

//routes
//create routes
router.post('/create-category', requireSignIn, isAdmin, createCategoryController);

//update routes
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController);

//get all category
router.get('/get-category', categoryController);

//single category
router.get("/single-category/:slug", singleCategoryController);

//delete category
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController);



export default router