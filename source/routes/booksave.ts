import express from 'express';
import book from '../controllers/booksave';

const router = express.Router();

router.post('/awssigningurl', book.awsSignInUrl)
router.post('/addbook', book.addBook);
router.post('/updatebook', book.updateBook);
router.post('/deletebook', book.deleteBook);

export = router;
