import express from 'express';
import methodOverride from 'method-override';
import {
    createCart, getCartById, addProductToCart, updateCart,
    updateProductQuantity, deleteProductFromCart, deleteCart,
    addProductSessionCart, purchaseCart, getAllCarts
} from '../controller/cart.controller.js';
import authorize from "../middlewares/authorization.js";
import passport from 'passport'; 
import { isAuth } from '../middlewares/auth.js';

const JWTauth  = isAuth;

const router = express.Router();

router.use(methodOverride('_method')); 

router.get('/', JWTauth, getAllCarts);
router.post('/', JWTauth, createCart);
router.get('/:cid', JWTauth, getCartById);

router.post('/:cid/products/:pid', JWTauth, authorize('user'), addProductToCart);
router.put('/:cid', JWTauth, authorize('user'), updateCart); 
router.put('/:cid/products/:pid', JWTauth, authorize('user'), updateProductQuantity); 
router.delete('/:cid/products/:pid', JWTauth, authorize('user'), deleteProductFromCart);
router.delete('/:cid', JWTauth, authorize('user'), deleteCart); 
router.post('/add-product', JWTauth, authorize('user'), addProductSessionCart);
router.post('/:cid/purchase', JWTauth, authorize('user'), purchaseCart); 

export default router;