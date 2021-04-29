import express from 'express';
import books from '../controllers/auth';

const router = express.Router();

router.post('/authcheck', books.authCheck);

export = router;
