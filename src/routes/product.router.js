import express from "express"
import passport from "passport";
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from "../controller/product.controller.js";
import authorize from "../middlewares/authorization.js";


const auth = passport.authenticate('jwt', { session: false });

const router = express.Router();

router.get('/', getProducts); 
router.get('/:pid', getProductById); 

router.post('/', auth, authorize('admin'), addProduct);
router.put('/:pid', auth, authorize('admin'), updateProduct);


router.delete('/:pid', auth, authorize('admin'), deleteProduct);

export default router;