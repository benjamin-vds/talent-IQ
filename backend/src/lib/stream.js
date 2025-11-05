import {StreamChat} from "stream-chat";
import { ENV } from "./env.js";

const apiKey =ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRETY;

export const chatClient = StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUser = async(userData) => {
    try {
        await chatClient.upsertUser(userData);
        console.info("Stream user upserted successfully: ", userData);
    }catch(error){
        console.error('Error upsert Stream user: ', error);
    }
}

export const deleteStreamUser = async(userId) => {
    try {
        await chatClient.deleteUser(userId);
        console.info("Stream user deleted successfully: ", userId);
    }catch(error){
        console.error('Error deleting Stream user: ', error);
    }
}

// todo: another method to generateToken