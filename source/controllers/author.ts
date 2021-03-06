// This file contains funtions to get authors, add author, update author, delete author

import { NextFunction, Response } from 'express';
import { IUserRequest } from '../interfaces/request'
import Joi from 'joi'
import moment from 'moment'

import { client } from '../config/postgresql'
import { formatJoiValErrors } from '../lib/errorhandling'

const getAllAuthor = async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    let bookArr = []
    let query = `SELECT id, fname, lname FROM authors`;

    const queryRes = await client.query(query);
    // assign values in qeuryRes to bookArr here...
    bookArr = queryRes.rows

    return res.json({ data: bookArr, success: true, msg: "Authors Loaded" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};

const addAuthor = async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {

    const { userid, isadmin } = req.session
    if (isadmin == 0) {
      throw Error('Only admins can add authors')
    }

    // Using joi schema to validate req body
    const joiSchema = Joi.object().keys({
      fname: Joi.string().required().min(2).max(50),
      lname: Joi.string().allow('').min(2).max(50),
    });

    const { error: joiError, value: dataObj } = joiSchema.validate(req.body);

    if (joiError) {
      return res.json({ errors: formatJoiValErrors(joiError), success: false, msg: 'Check Parameters' });
    }

    // Insert query
    let query = `INSERT INTO authors
    (fname, lname, ct, cby)
    VALUES (${dataObj.fname}, '${dataObj.lname}', '${moment.utc().format('YYYY-MM-DD HH:mm:ss')}', ${userid})`;

    await client.query(query);

    return res.json({ success: true, msg: "Author added" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};

const updateAuthor = async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {

    const { userid, isadmin } = req.session
    if (isadmin == 0) {
      throw Error('Only admins can update authors')
    }

    // Using joi schema to validate req body
    const joiSchema = Joi.object().keys({
      authorid: Joi.number().integer().required(),
      fname: Joi.string().required().min(2).max(50),
      lname: Joi.string().allow('').min(2).max(50),
    });

    const { error: joiError, value: dataObj } = joiSchema.validate(req.body);

    if (joiError) {
      return res.json({ errors: formatJoiValErrors(joiError), success: false, msg: 'Check Parameters' });
    }

    // Update query
    let query = `UPDATE authors
    SET fname = ${dataObj.fname}, lname = '${dataObj.lname}', mt = '${moment.utc().format('YYYY-MM-DD HH:mm:ss')}', mby = ${userid}
    WHERE id = ${dataObj.authorid} LIMIT 1`;

    await client.query(query);

    return res.json({ success: true, msg: "Author Updated" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};

const deleteAuthor = async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {

    // Using joi schema to validate req body
    const joiSchema = Joi.object().keys({
      authorid: Joi.number().integer().required(),
    });

    const { error: joiError, value: dataObj } = joiSchema.validate(req.body);

    if (joiError) {
      return res.json({ errors: formatJoiValErrors(joiError), success: false, msg: 'Check Parameters' });
    }

    // Delete query
    let query = `DELETE FROM authors
    WHERE id = ${dataObj.authorid} LIMIT 1`;

    await client.query(query);

    return res.json({ success: true, msg: "Authors Deleted" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};


export default { getAllAuthor, addAuthor, updateAuthor, deleteAuthor };
