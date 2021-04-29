const _ = require('lodash');
const { adminFb } = require('./firebase');

import { client } from '../config/postgresql'

async function checkClientAuth(req: any, res: any, next: any) {
  // This function is use to check if authroized user are viewing the content or not

  // Check if the user is authenticated (i.e. logged in)
  let statusCode = 401;

  try {
    const authToken = req.headers.authtoken
    // Check auth token
    if (!authToken) throw Error('Authentication Token Missing');

    statusCode = 401
    const { email_verified, email } = await adminFb.auth().verifyIdToken(authToken)

    statusCode = 412
    // Check email verification
    if (!email_verified) throw Error('Email Not verified')

    // Get id of user
    const query = `SELECT id FROM users
    WHERE email = ${email} LIMIT 1`

    const queryRes = await client.query(query);

    const { id } = queryRes.rows
    
    // add it in req.session to be used by apis
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
