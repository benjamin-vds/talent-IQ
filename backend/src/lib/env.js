import dotenv from "dotenv";
// reading the enviroment files
dotenv.config();


//Setting the enviroment variables
export const ENV = {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
}