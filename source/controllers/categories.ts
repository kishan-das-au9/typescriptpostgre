import { NextFunction, Request, Response } from 'express';
import Joi from 'joi'
import moment from 'moment'

import { client } from '../config/postgresql'
import { formatJoiValErrors } from '../lib/errorhandling'

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

    const joiSchema = Joi.object().keys({
      catname: Joi.string().required().min(2).max(100),
    });

    const { error: joiError, value: dataObj } = joiSchema.validate(req.body);

    if (joiError) {
      return res.json({ errors: formatJoiValErrors(joiError), success: false, msg: 'Check Parameters' });
    }

    // Adding cby manually for now.
    // Todo: Later get the data from sessions
    const userid = 1

    let query = `INSERT INTO categories
    (catname, ct, cby)
    VALUES ('${dataObj.catname}','${moment.utc().format('YYYY-MM-DD HH:mm:ss')}', ${userid})`;

    await client.query(query);

    return res.json({ success: true, msg: "Category added" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};

const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const joiSchema = Joi.object().keys({
      catid: Joi.number().integer().required(),
      catname: Joi.string().required().min(2).max(100).trim(),
    });

    const { error: joiError, value: dataObj } = joiSchema.validate(req.body);

    if (joiError) {
      return res.json({ errors: formatJoiValErrors(joiError), success: false, msg: 'Check Parameters' });
    }

    // Adding cby manually for now.
    // Todo: Later get the data from sessions
    const userid = 1

    let query = `UPDATE categories
    SET catname = '${dataObj.catname}', mt = '${moment.utc().format('YYYY-MM-DD HH:mm:ss')}', mby = ${userid}
    WHERE id = ${dataObj.catid}`;

    await client.query(query);

    return res.json({ success: true, msg: "Category Updated" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const joiSchema = Joi.object().keys({
      catid: Joi.number().integer().required(),
    });

    const { error: joiError, value: dataObj } = joiSchema.validate(req.body);

    if (joiError) {
      return res.json({ errors: formatJoiValErrors(joiError), success: false, msg: 'Check Parameters' });
    }

    let query = `DELETE FROM categories
    WHERE id = ${dataObj.catid}`;

    await client.query(query);

    return res.json({ success: true, msg: "Category Deleted" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};


export default { getAllCategories, addCategory, updateCategory, deleteCategory };
