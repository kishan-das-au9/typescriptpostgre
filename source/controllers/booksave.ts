// This file contains funtions to  add book, update book, delete book

import { NextFunction, Request, Response } from 'express';
import Joi from 'joi'
import moment from 'moment'

import { client } from '../config/postgresql'
import { formatJoiValErrors } from '../lib/errorhandling'

const addBook = async (req: Request, res: Response, next: NextFunction) => {
  try {

    // Using joi schema to validate req body
    const joiSchema = Joi.object().keys({
      awskey: Joi.string().required().min(2).max(50),
      coverpage: Joi.string().required().min(2).max(50),
      title: Joi.string().required().min(2).max(250),
      pages: Joi.number().integer().allow(''),
      edition: Joi.number().integer().allow(''),
      authorid: Joi.number().integer().required(),
      publisherid: Joi.number().integer().allow(''),
      pubyear: Joi.number().integer().allow(''),
      sectionid: Joi.number().integer().allow(''),
      description: Joi.string().allow('')
    });

    const { error: joiError, value: dataObj } = joiSchema.validate(req.body);

    if (joiError) {
      return res.json({ errors: formatJoiValErrors(joiError), success: false, msg: 'Check Parameters' });
    }

    // Adding cby manually for now.
    // Todo: Later get the data from sessions
    const userid = 1

    // Insert query
    let query = `INSERT INTO books
    (awskey, title, cover_page, pages, edition, author_id, publisher_id, pub_year, section_id, description, ct, cby)
    VALUES (${dataObj.awskey}, '${dataObj.title}', '${dataObj.coverpage}', '${dataObj.pages}',
    '${dataObj.edition}', '${dataObj.authorid}', '${dataObj.publisherid}', '${dataObj.pubyear}',
    '${dataObj.sectionid}', '${dataObj.description}', '${moment.utc().format('YYYY-MM-DD HH:mm:ss')}', ${userid})`;

    await client.query(query);

    return res.json({ success: true, msg: "Author added" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {

    // Using joi schema to validate req body
    const joiSchema = Joi.object().keys({
      bookid: Joi.number().integer().required(),
      coverpage: Joi.string().required().min(2).max(50),
      title: Joi.string().required().min(2).max(250),
      pages: Joi.number().integer().allow(''),
      edition: Joi.number().integer().allow(''),
      authorid: Joi.number().integer().required(),
      publisherid: Joi.number().integer().allow(''),
      pubyear: Joi.number().integer().allow(''),
      sectionid: Joi.number().integer().allow(''),
      description: Joi.string().allow('')
    });

    const { error: joiError, value: dataObj } = joiSchema.validate(req.body);

    if (joiError) {
      return res.json({ errors: formatJoiValErrors(joiError), success: false, msg: 'Check Parameters' });
    }

    // Adding cby manually for now.
    // Todo: Later get the data from sessions
    const userid = 1

    // Update query

    let query = `UPDATE books
    SET title = ${dataObj.title}, cover_page = '${dataObj.coverpage}',
    pages = ${dataObj.pages}, edition = '${dataObj.edition}',
    author_id = ${dataObj.authorid}, publisher_id = '${dataObj.publisherid}',
    pub_year = ${dataObj.pubyear}, section_id = '${dataObj.sectionid}', description = '${dataObj.description}'
    mt = '${moment.utc().format('YYYY-MM-DD HH:mm:ss')}', mby = ${userid}
    WHERE id = ${dataObj.bookid} LIMIT 1`;

    await client.query(query);

    return res.json({ success: true, msg: "Book Updated" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {

    // Using joi schema to validate req body
    const joiSchema = Joi.object().keys({
      bookid: Joi.number().integer().required(),
    });

    const { error: joiError, value: dataObj } = joiSchema.validate(req.body);

    if (joiError) {
      return res.json({ errors: formatJoiValErrors(joiError), success: false, msg: 'Check Parameters' });
    }

    // Delete query

    let query = `DELETE FROM books
    WHERE id = ${dataObj.bookid} LIMIT 1`;

    await client.query(query);

    return res.json({ success: true, msg: "Book Deleted" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};


export default { addBook, updateBook, deleteBook };
