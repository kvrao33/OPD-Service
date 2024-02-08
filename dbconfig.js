// main.js (or wherever you run your script)
import { Connector } from '@google-cloud/cloud-sql-connector';
import knex from 'knex';
import 'dotenv/config';
import * as config from './config.js';

const connector = new Connector();
const clientOpts = await connector.getOptions({
  instanceConnectionName: config.INSTANCE,
  ipType: process.env.POSTGRES_IP_Type,
});


const knexInstance = knex({
  client: 'pg',
  connection: {
    ...clientOpts,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
  },
  pool: { min: 0, max: 5 }, // Adjust the pool configuration as needed
});


// use this knexInstance for query 
 export default knexInstance;
