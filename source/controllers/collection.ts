// This file contains funtions to  getall collections, add collection, delete collection

import { NextFunction, Request, Response } from 'express';
import Joi from 'joi'
import moment from 'moment'

import { client } from '../config/postgresql'
import { formatJoiValErrors } from '../lib/errorhandling'

const getAllCollections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let collectionArr = []
    let query = `SELECT 
    *
    FROM collections`;

    const queryRes = await client.query(query);
    // assign values in qeuryRes to collectionArr here...
    collectionArr = queryRes.rows

    return res.json({ data: collectionArr, success: true, msg: "Collections Loaded" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};

const addCollection = async (req: Request, res: Response, next: NextFunction) => {
  try {

     // Using joi schema to validate req body
    const joiSchema = Joi.object().keys({
      bookid: Joi.number().integer().required(),
    });

    const { error: joiError, value: dataObj } = joiSchema.validate(req.body);

    if (joiError) {
      return res.json({ errors: formatJoiValErrors(joiError), success: false, msg: 'Check Parameters' });
    }

    // Adding cby manually for now.
    // Todo: Later get the data from sessions
    const userid = 1

    // Insert query
    let query = `INSERT INTO collections
    (user_id, book_id, ct)
    VALUES (${userid}, '${dataObj.bookid}', '${moment.utc().format('YYYY-MM-DD HH:mm:ss')}')`;

    await client.query(query);

    return res.json({ success: true, msg: "Collection added" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};

const deleteCollection = async (req: Request, res: Response, next: NextFunction) => {
  try {

     // Using joi schema to validate req body
    const joiSchema = Joi.object().keys({
      colectionid: Joi.number().integer().required(),
    });

    const { error: joiError, value: dataObj } = joiSchema.validate(req.body);

    if (joiError) {
      return res.json({ errors: formatJoiValErrors(joiError), success: false, msg: 'Check Parameters' });
    }

    // Delete query
    let query = `DELETE FROM collections
    WHERE id = ${dataObj.colectionid} LIMIT 1`;

    await client.query(query);

    return res.json({ success: true, msg: "Collections Deleted" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};


export default { getAllCollections, addCollection, deleteCollection };
