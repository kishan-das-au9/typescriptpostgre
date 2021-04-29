import express from 'express';
import category from '../controllers/author';

const router = express.Router();

router.post('/authorlist', category.getAllAuthor);
router.post('/addauthor', category.addAuthor);
router.post('/updateauthor', category.updateAuthor);
router.post('/deleteauthor', category.deleteAuthor);

export = router;
