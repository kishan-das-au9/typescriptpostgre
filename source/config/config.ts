import dotenv from 'dotenv';

dotenv.config();

// Database config setup
const RDS_HOST = process.env.RDS_HOST || 'localhost';
const RDS_DATABASE = process.env.RDS_DATABASE || 'library';
const RDS_USER = process.env.RDS_USERNAME || 'postgres';
const RDS_PASS = process.env.RDS_HOST || 'root';

const POSTGRESQL = {
    host: RDS_HOST,
    database: RDS_DATABASE,
    user: RDS_USER,
    pass: RDS_PASS
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 1337;

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
};

const config = {
    postgresql: POSTGRESQL,
    server: SERVER
};

export default config;
