import express from 'express';
import category from '../controllers/publisher';

const router = express.Router();

router.post('/publusherlist', category.getAllPublisher);
router.post('/addpublisher', category.addPublisher);
router.post('/updatepublisher', category.updatePublisher);
router.post('/deletepublisher', category.deletePublsher);

export = router;
