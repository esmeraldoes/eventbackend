/* eslint-disable no-undef */
import dotenv from 'dotenv';
import path from 'path';


dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT||3000,
  database_url: process.env.MONGO_URI,
  bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt: {
    secret: process.env.JWT_SECRET,
    expires_in: process.env.JWT_EXPIRATION||200000000,
    refresh_secret: process.env.JWT_REFRESH_SECRET||"UDOH",
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRATION||20000000,
  },
 
};
