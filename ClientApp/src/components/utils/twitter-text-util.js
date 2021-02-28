import twttr from 'twitter-text';
import { getFunctionSecretKey } from './azure-key-value'
import get

export const validateTweetBody = (text)=> {
    const result = twttr.parseTweet(text);
    const maxChars = 280;
    if (result) {
        let textReturn = `${result.weightedLength} / ${maxChars}`;
        let isValid = result.weightedLength <= maxChars ? true : false;
        return {
            textReturn: textReturn,
            isValid: isValid
        }
    }
}

export const validateTweetAzureFunction = async(text)=>{
    const functionSecretKey = await getFunctionSecretKey(functionName);
    const functionResult = await getFunctionValidateTweetBody()
}