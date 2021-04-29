import express from 'express';
import category from '../controllers/categories';

const router = express.Router();

router.post('/sectionlist', category.getAllCategories);
router.post('/addsection', category.addCategory);
router.post('/updatesection', category.updateCategory);
router.post('/deletesection', category.deleteCategory);

export = router;
