import express from 'express';
import section from '../controllers/section';

const router = express.Router();

router.post('/sectionlist', section.getAllSections);
router.post('/addsection', section.addSection);
router.post('/updatesection', section.updateSection);
router.post('/deletesection', section.deleteSection);

export = router;
