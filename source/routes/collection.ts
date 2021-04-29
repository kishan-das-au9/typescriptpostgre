import express from 'express';
import collection from '../controllers/collection';

const router = express.Router();

router.post('/collectionlist', collection.getAllCollections);
router.post('/addcollection', collection.addCollection);
router.post('/deletecollection', collection.deleteCollection);

export = router;
