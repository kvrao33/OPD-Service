// config.js
import getSecret from "./utility/getSecret.js";

export const PORT = process.env.PORT || 8081;
export const INSTANCE = await getSecret("Cyber-Postgre-Db-Instance");
export const DB_NAME = await getSecret("Cyber-Postgre-Db-Name") ;
export const DB_USER = await getSecret("Cyber-Postgre-Db-User") ;
export const DB_PASSWORD = await getSecret("Cyber-Postgre-Db-Password");
export const EXPORTED_FILE_BUCKET_NAME = await getSecret("Cyber-Bucket-Name");
