import {StreamChat} from "stream-chat"
import "dotenv/config"

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECTRET;

if(!apiKey || !apiSecret){
    console.log("Stream API key or secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUser = async(userData) =>{
    try{
        await streamClient.upsertUsers([userData]);
        return userData;
    }
    catch(err){
        console.log("Error upserting stream user :", err)
    }
}

export const generateStreamToken = (userId) =>{
    try {
        const userIdstr = userId.toString();
        const token = streamClient.createToken(userIdstr);
        return token;
    } catch (error) {
        console.error("Error generating Stream token:", error);
        throw new Error("Failed to generate Stream token");
    }
}
