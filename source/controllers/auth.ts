import { NextFunction, Request, Response } from 'express';
import moment from 'moment'

import { client } from '../config/postgresql'
import { adminFb } from "../lib/firebase"

// Function to authenticate firebase login

const authCheck = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if auth token is present
    if (!req.headers.authtoken) {
      throw Error('Authentication Token Missing')
    }
    // Get User data from firebase
    const userData = await adminFb.auth().verifyIdToken(req.headers.authtoken.toString());
    const { email, name, uid, email_verified } = userData;

    // If email is missing throw error
    if (!email) {
      throw new Error('Phone Number & Email missing for the User');
    }

    // If email is not verified throw error
    if (!email_verified) {
      throw Error(`Email: ${email} not verified`);
    }

    // Check if user exists in our database
    const query = `SELECT * FROM users
    WHERE uid = ${uid} and email = ${email} LIMIT 1`

    const queryRes = await client.query(query);

    // If user does not exist in our database then insert
    if (queryRes.rows == undefined) {
      const insertUser = `INSERT INTO users
      (uid, email, username, ct)
      VALUES (${uid}, '${email}',${name}, '${moment.utc().format('YYYY-MM-DD HH:mm:ss')}')`;

      await client.query(insertUser);
    }

    return res.json({ success: true, msg: "User Logged In" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }
};

export default { authCheck };
