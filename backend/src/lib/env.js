import dotenv from "dotenv";
// reading the enviroment files
dotenv.config();
// we don't check port because it will be deployed on default port
const requiredEnvVars = ['DB_URL', 'NODE_ENV'];
console.log('test : ', process.env.DB_URL);


const missing = requiredEnvVars.filter((key)=> !process.env[key]);

if(missing.length > 0){
    throw new Error(`Missing required environment variables: ${missing.join(',')}`)
}

//Setting the enviroment variables
export const ENV = {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    NODE_ENV: process.env.NODE_ENV,
}