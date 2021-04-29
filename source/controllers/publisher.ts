import { NextFunction, Request, Response } from 'express';
import Joi from 'joi'
import moment from 'moment'

import { client } from '../config/postgresql'
import { formatJoiValErrors } from '../lib/errorhandling'

const getAllPublisher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let publisherArr = []
    let query = `SELECT 
    *
    FROM publishers`;

    const queryRes = await client.query(query);
    // assign values in qeuryRes to publisherArr here...
    publisherArr = queryRes.rows

    return res.json({ data: publisherArr, success: true, msg: "Publishers Loaded" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};

const addPublisher = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const joiSchema = Joi.object().keys({
      pname: Joi.string().required().min(2).max(100),
      location: Joi.string().allow('').min(2).max(100),
    });

    const { error: joiError, value: dataObj } = joiSchema.validate(req.body);

    if (joiError) {
      return res.json({ errors: formatJoiValErrors(joiError), success: false, msg: 'Check Parameters' });
    }

    // Adding cby manually for now.
    // Todo: Later get the data from sessions
    const userid = 1

    let query = `INSERT INTO publishers
    (pname, location, ct, cby)
    VALUES (${dataObj.pname}, '${dataObj.location}', '${moment.utc().format('YYYY-MM-DD HH:mm:ss')}', ${userid})`;

    await client.query(query);

    return res.json({ success: true, msg: "Publisher added" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};

const updatePublisher = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const joiSchema = Joi.object().keys({
      pid: Joi.number().integer().required(),
      pname: Joi.string().required().min(2).max(100),
      location: Joi.string().allow('').min(2).max(100),
    });

    const { error: joiError, value: dataObj } = joiSchema.validate(req.body);

    if (joiError) {
      return res.json({ errors: formatJoiValErrors(joiError), success: false, msg: 'Check Parameters' });
    }

    // Adding cby manually for now.
    // Todo: Later get the data from sessions
    const userid = 1

    let query = `UPDATE publishers
    SET pname = ${dataObj.pname}, location = '${dataObj.location}', mt = '${moment.utc().format('YYYY-MM-DD HH:mm:ss')}', mby = ${userid}
    WHERE id = ${dataObj.pid}`;

    await client.query(query);

    return res.json({ success: true, msg: "Publisher Updated" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};

const deletePublsher = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const joiSchema = Joi.object().keys({
      pid: Joi.number().integer().required(),
    });

    const { error: joiError, value: dataObj } = joiSchema.validate(req.body);

    if (joiError) {
      return res.json({ errors: formatJoiValErrors(joiError), success: false, msg: 'Check Parameters' });
    }

    let query = `DELETE FROM publishers
    WHERE id = ${dataObj.pid}`;

    await client.query(query);

    return res.json({ success: true, msg: "Publishers Deleted" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};


export default { getAllPublisher, addPublisher, updatePublisher, deletePublsher };
