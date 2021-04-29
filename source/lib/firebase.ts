import adminFb from 'firebase-admin'
const serviceAccount = require('../../firebase.json');

adminFb.initializeApp({
  credential: adminFb.credential.cert(serviceAccount),
});

export { adminFb }

