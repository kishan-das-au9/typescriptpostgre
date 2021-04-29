import { NextFunction, Request, Response } from 'express';
import { client } from '../config/postgresql'

const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let bookArr = []
    let query = `SELECT 
    *
    FROM categories`;

    const queryRes = await client.query(query);
    // assign values in qeuryRes to bookArr here...
    bookArr = queryRes.rows

    return res.json({ data: bookArr, success: true, msg: "Category Loaded" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};

const addCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let bookArr = []
    let query = `SELECT 
    *
    FROM categories`;

    const queryRes = await client.query(query);
    // assign values in qeuryRes to bookArr here...
    bookArr = queryRes.rows

    return res.json({ data: bookArr, success: true, msg: "Category Loaded" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};


export default { getAllCategories, addCategory };
