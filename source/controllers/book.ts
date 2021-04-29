import { NextFunction, Request, Response } from 'express';
import { client } from '../config/postgresql'

const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let bookArr = []
    let query = `SELECT 
    *
    FROM books`;

    const queryRes = await client.query(query);
    // assign values in qeuryRes to bookArr here...
    bookArr = queryRes.rows

    return res.json({ data: bookArr, success: true, msg: "Book Loaded" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};

export default { getAllBooks };
