// This file contains funtions to  getall collections, add collection, delete collection

import { NextFunction, Response } from 'express';
import { IUserRequest } from '../interfaces/request'
import Joi from 'joi'
import moment from 'moment'

import { client } from '../config/postgresql'
import { formatJoiValErrors } from '../lib/errorhandling'

const getAllCollections = async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    // Get all collections of a specific user
    const { userid } = req.session

    let collectionArr = []
    let query = `SELECT 
    collections.id, books.awskey, books.title, books.cover_page, books.pages, books.edition
    books.pub_year, books.description, books.author_id,
    authors.fname, authors.lname, books.publisher_id, publishers.pname,
    books.section_id, sections.section_name, sections.category_id, categories.catname,
    FROM collections
    JOIN books on collections.book_id = books.id
    FROM books
    LEFT JOIN authors ON books.author_id = authors.id
    LEFT JOIN publishers ON books.publisher_id = publishers.id
    LEFT JOIN sections ON books.section_id = sections.id
    LEFT JOIN categories ON sections.category_id = categories.id
    WHERE user_id = ${userid}`;

    const queryRes = await client.query(query);
    // assign values in qeuryRes to collectionArr here...
    collectionArr = queryRes.rows

    return res.json({ data: collectionArr, success: true, msg: "Collections Loaded" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};

const addCollection = async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {

     // Using joi schema to validate req body
    const joiSchema = Joi.object().keys({
      bookid: Joi.number().integer().required(),
    });

    const { error: joiError, value: dataObj } = joiSchema.validate(req.body);

    if (joiError) {
      return res.json({ errors: formatJoiValErrors(joiError), success: false, msg: 'Check Parameters' });
    }

    const { userid } = req.session
    
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

const deleteCollection = async (req: IUserRequest, res: Response, next: NextFunction) => {
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
