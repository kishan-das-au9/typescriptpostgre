// This file contains api function to get all books

import { NextFunction, Request, Response } from 'express';
import Joi from 'joi'

import { formatJoiValErrors } from '../lib/errorhandling'
import { client } from '../config/postgresql'

const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {

    // Using joi schema to validate req body
    const joiSchema = Joi.object().keys({
      title: Joi.string().allow(''),
      author: Joi.string().allow(''),
      publisher: Joi.string().allow(''),
      section: Joi.string().allow(''),
      category: Joi.string().allow(''),
      pageno: Joi.number().integer().required().min(1),
      pagelimit: Joi.number().integer().required().min(100),
    });

    const { error: joiError, value: dataObj } = joiSchema.validate(req.body);

    if (joiError) {
      return res.json({ errors: formatJoiValErrors(joiError), success: false, msg: 'Check Parameters' });
    }

    let bookArr = []
    // Use to find whether to concat and or where for where clause
    let iswhere = 0
    // To limit the total number of books and allow pagination. Improving performance
    let pageoffset = (dataObj.pageno - 1) * dataObj.pagelimit

    let query = ` SELECT
    books.awskey, books.title, books.cover_page, books.pages, books.edition, books.pub_year, books.description,
    books.author_id, authors.fname, authors.lname, books.publisher_id, publishers.pname,
    books.section_id, sections.section_name, sections.category_id, categories.catname,
    FROM books
    LEFT JOIN authors ON books.author_id = authors.id
    LEFT JOIN publishers ON books.publisher_id = publishers.id
    LEFT JOIN sections ON books.section_id = sections.id
    LEFT JOIN categories ON sections.category_id = categories.id `;

    if (dataObj.title) {
      iswhere = 1
      query += ` WHERE books.title LIKE '%${dataObj.title}%'`
    }

    if (dataObj.author) {
      const prefix = iswhere ? 'AND' : 'WHERE'
      iswhere = 1
      query += ` ${prefix} authors.fname LIKE '%${dataObj.author}%' AND authors.lname LIKE '%${dataObj.author}%' `
    }

    if (dataObj.publisher) {
      const prefix = iswhere ? 'AND' : 'WHERE'
      iswhere = 1
      query += ` ${prefix} publishers.pname LIKE '%${dataObj.publisher}%' `
    }

    if (dataObj.section) {
      const prefix = iswhere ? 'AND' : 'WHERE'
      iswhere = 1
      query += ` ${prefix} sections.section_name LIKE '%${dataObj.section}%' `
    }

    if (dataObj.section) {
      const prefix = iswhere ? 'AND' : 'WHERE'
      iswhere = 1
      query += ` ${prefix} sections.section_name LIKE '%${dataObj.section}%' `
    }

    if (dataObj.category) {
      const prefix = iswhere ? 'AND' : 'WHERE'
      iswhere = 1
      query += ` ${prefix} categories.catname LIKE '%${dataObj.category}%' `
    }

    query += ` LIMIT ${dataObj.pageno} OFFSET ${pageoffset} `


    const queryRes = await client.query(query);
    // assign values in qeuryRes to bookArr here...
    bookArr = queryRes.rows

    return res.json({ data: bookArr, success: true, msg: "Book Loaded" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};

export default { getAllBooks };
