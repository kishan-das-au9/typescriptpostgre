const _ = require('lodash');
const { adminFb } = require('./firebase');

import { client } from '../config/postgresql'

async function checkClientAuth(req: any, res: any, next: any) {

  // Check if the user is authenticated (i.e. logged in)
  let statusCode = 401;

  try {
    const authToken = req.headers.authtoken
    if (!authToken) throw Error('Authentication Token Missing');

    statusCode = 401
    const { email_verified, email } = await adminFb.auth().verifyIdToken(authToken)

    statusCode = 412
    if (!email_verified) throw Error('Email Not verified')

    const query = `SELECT id FROM users
    WHERE email = ${email} LIMIT 1`

    const queryRes = await client.query(query);

    const { id } = queryRes.rows

    req.session = { email, userid: id }
    next();

  } catch (err) {
    // Most probably there was error in verifying Token
    res.status(statusCode).json({
      success: false,
      msg: err.message || err,
      errorcode: err.code || null,
    });
  }

}

export { checkClientAuth };
