import express from 'express';
import category from '../controllers/booksave';

const router = express.Router();

router.post('/addbook', category.addBook);
router.post('/updatebook', category.updateBook);
router.post('/deletebook', category.deleteBook);

export = router;
