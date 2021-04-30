// This file contains funtions to  getall categories, add category, update category, delete category

import { NextFunction, Response } from 'express';
import { IUserRequest } from '../interfaces/request'
import Joi from 'joi'
import moment from 'moment'

import { client } from '../config/postgresql'
import { formatJoiValErrors } from '../lib/errorhandling'

const getAllCategories = async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    let bookArr = []
    let query = `SELECT id, catname FROM categories`;

    const queryRes = await client.query(query);
    // assign values in qeuryRes to bookArr here...
    bookArr = queryRes.rows

    return res.json({ data: bookArr, success: true, msg: "Category Loaded" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};

const addCategory = async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {

    const { userid, isadmin } = req.session
    if (isadmin == 0) {
      throw Error('Only admins can add categories')
    }

    // Using joi schema to validate req body
    const joiSchema = Joi.object().keys({
      catname: Joi.string().required().min(2).max(100),
    });

    const { error: joiError, value: dataObj } = joiSchema.validate(req.body);

    if (joiError) {
      return res.json({ errors: formatJoiValErrors(joiError), success: false, msg: 'Check Parameters' });
    }

    // Insert query
    let query = `INSERT INTO categories
    (catname, ct, cby)
    VALUES ('${dataObj.catname}','${moment.utc().format('YYYY-MM-DD HH:mm:ss')}', ${userid})`;

    await client.query(query);

    return res.json({ success: true, msg: "Category added" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};

const updateCategory = async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {

    const { userid, isadmin } = req.session
    if (isadmin == 0) {
      throw Error('Only admins can update categories')
    }

    // Using joi schema to validate req body
    const joiSchema = Joi.object().keys({
      catid: Joi.number().integer().required(),
      catname: Joi.string().required().min(2).max(100).trim(),
    });

    const { error: joiError, value: dataObj } = joiSchema.validate(req.body);

    if (joiError) {
      return res.json({ errors: formatJoiValErrors(joiError), success: false, msg: 'Check Parameters' });
    }

    // Update query
    let query = `UPDATE categories
    SET catname = '${dataObj.catname}', mt = '${moment.utc().format('YYYY-MM-DD HH:mm:ss')}', mby = ${userid}
    WHERE id = ${dataObj.catid} LIMIT 1`;

    await client.query(query);

    return res.json({ success: true, msg: "Category Updated" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};

const deleteCategory = async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {

    const { isadmin } = req.session
    if (isadmin == 0) {
      throw Error('Only admins can delete categories')
    }

    // Using joi schema to validate req body
    const joiSchema = Joi.object().keys({
      catid: Joi.number().integer().required(),
    });

    const { error: joiError, value: dataObj } = joiSchema.validate(req.body);

    if (joiError) {
      return res.json({ errors: formatJoiValErrors(joiError), success: false, msg: 'Check Parameters' });
    }

    // Delete query
    let query = `DELETE FROM categories
    WHERE id = ${dataObj.catid} LIMIT 1`;

    await client.query(query);

    return res.json({ success: true, msg: "Category Deleted" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};


export default { getAllCategories, addCategory, updateCategory, deleteCategory };
