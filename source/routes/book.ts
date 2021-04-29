import express from 'express';
import books from '../controllers/book';

const router = express.Router();

router.post('/getbooklist', books.getAllBooks);

export = router;
