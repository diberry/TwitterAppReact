import axios from 'axios';

const baseUrl = process.env.BASE_URL || "https://mstwitterbot.azurewebsites.net/";

export const getFunctionValidateTweetBody = async(functionKey, text)=> {

    if (!functionKey || !text) throw Error("http-utils::missing params");
    
    const options = {
        method: 'post',
        url: `${baseUrl}api/validateTweet`,
        data: {
            "tweetText": text
        },
        headers: {
            "Content-Type": "application/json",
            "x-functions-key": functionKey
        }
      }
    
    const resultFunction = await axios.post(options);


    return resultFunction;
}