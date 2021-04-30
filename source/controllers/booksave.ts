// This file contains funtions to  add book, update book, delete book

import { NextFunction, Response } from 'express';
import { IUserRequest } from '../interfaces/request'
import Joi from 'joi'
import moment from 'moment'

import { client } from '../config/postgresql'
import { formatJoiValErrors } from '../lib/errorhandling'
import { getUploadSignedUrl, deleteFileAws } from '../lib/fileupload'

// Use to get signinurl for book/cover uploaded to s3
const awsSignInUrl = async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {

    const { isadmin } = req.session
    if (isadmin == 0) {
      throw Error('Only admins can upload files')
    }


    // Using joi schema to validate req body
    const joiSchema = Joi.object().keys({
      filename: Joi.string().required(),
    });

    const { error: joiError, value: dataObj } = joiSchema.validate(req.body);

    if (joiError) {
      return res.json({ errors: formatJoiValErrors(joiError), success: false, msg: 'Check Parameters' });
    }

    const { url, fileUuidName } = getUploadSignedUrl(dataObj.filename);

    res.json({ data: { url, fileuuidname: fileUuidName }, success: true, message: 'Signed url' });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};

const addBook = async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {

    const { userid, isadmin } = req.session
    if (isadmin == 0) {
      throw Error('Only admins can add authors')
    }

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

const updateBook = async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    
    const { userid, isadmin } = req.session
    if (isadmin == 0) {
      throw Error('Only admins can update books')
    }

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

const deleteBook = async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {

    const { isadmin } = req.session
    if (isadmin == 0) {
      throw Error('Only admins can delete books')
    }

    // Using joi schema to validate req body
    const joiSchema = Joi.object().keys({
      bookid: Joi.number().integer().required(),
    });

    const { error: joiError, value: dataObj } = joiSchema.validate(req.body);

    if (joiError) {
      return res.json({ errors: formatJoiValErrors(joiError), success: false, msg: 'Check Parameters' });
    }


    const query1 = `SELECT awskey, cover_page FROM books LIMIT 1`;
    const bookObj = await client.query(query1)
    // Delete file from aws S3
    await deleteFileAws(bookObj.awskey);
    // delete page cover from aws S3
    await deleteFileAws(bookObj.cover_page);

    // Delete query
    let query = `DELETE FROM books
    WHERE id = ${dataObj.bookid} LIMIT 1`;

    await client.query(query);

    return res.json({ success: true, msg: "Book Deleted" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};


export default { awsSignInUrl, addBook, updateBook, deleteBook };
