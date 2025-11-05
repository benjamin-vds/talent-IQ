import dotenv from "dotenv";
// reading the enviroment files
dotenv.config();

const requiredEnvVars = ['PORT','DB_URL'];
const missing = requiredEnvVars.filter((key)=> !process.env[key]);

if(missing.length > 0){
    throw new Error(`Missing required environment variables: ${missing.join(',')}`)
}

//Setting the enviroment variables
export const ENV = {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
}