import express from 'express';
import category from '../controllers/collection';

const router = express.Router();

router.post('/collectionlist', category.getAllCollections);
router.post('/addcollection', category.addCollection);
router.post('/deletecollection', category.deleteCollection);

export = router;
