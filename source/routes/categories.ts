import express from 'express';
import category from '../controllers/categories';

const router = express.Router();

router.post('/categorylist', category.getAllCategories);
router.post('/addcategory', category.addCategory);

export = router;
