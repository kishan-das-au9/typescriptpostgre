import config from './config';

const { Client } = require('pg');
const connectionString = `postgres://${config.postgresql.user}:${config.postgresql.pass}@${config.postgresql.host}:5432/${config.postgresql.database}`

const client = new Client({
    connectionString: connectionString
});

export { client };
