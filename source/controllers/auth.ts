import { NextFunction, Request, Response } from 'express';
import moment from 'moment'

import { client } from '../config/postgresql'
import { adminFb } from "../lib/firebase"


const authCheck = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authtoken) {
      throw Error('Authentication Token Missing')
    }
    const userData = await adminFb.auth().verifyIdToken(req.headers.authtoken.toString());
    const { email, name, uid, email_verified } = userData;

    if (!email) {
      throw new Error('Phone Number & Email missing for the User');
    }

    if (!email_verified) {
      throw Error(`Email: ${email} not verified`);
    }

    const query = `SELECT * FROM users
    WHERE id = ${uid} LIMIT 1`

    const queryRes = await client.query(query);

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
