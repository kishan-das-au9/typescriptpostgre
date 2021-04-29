import express from 'express';
import category from '../controllers/section';

const router = express.Router();

router.post('/sectionlist', category.getAllSections);
router.post('/addsection', category.addSection);
router.post('/updatesection', category.updateSection);
router.post('/deletesection', category.deleteSection);

export = router;
