import express from 'express';
import publisher from '../controllers/publisher';

const router = express.Router();

router.post('/publusherlist', publisher.getAllPublisher);
router.post('/addpublisher', publisher.addPublisher);
router.post('/updatepublisher', publisher.updatePublisher);
router.post('/deletepublisher', publisher.deletePublsher);

export = router;
