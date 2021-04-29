import express from 'express';
import category from '../controllers/categories';

const router = express.Router();

router.post('/categorylist', category.getAllCategories);
router.post('/addcategory', category.addCategory);
router.post('/updatecategory', category.updateCategory);
router.post('/deletecategory', category.deleteCategory);

export = router;
