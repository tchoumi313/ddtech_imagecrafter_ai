import express from "express";
import * as dotenv from 'dotenv'

import {OpenAIApi, Configuration} from 'openai';

import Post from '../mongoDB/models/post.js'

dotenv.config()

const router = express.Router()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // ,OpenAIAPIKey
});
const openai = new OpenAIApi(configuration);

router.route('/').get((req, res) => {
    res.send("Hello from OpenApi Dall-E")
})

router.route('/').post(async (req, res) => {
    try {
        const {prompt} = req.body;
        const response = await openai.createImage({
            prompt: prompt,
            /* temperature: 0.7,
            top_p: 1, */
            size: '1024x1024',
            n: 1,
            /*  frequency_penalty: 0,
             presence_penalty: 0, */
            response_format: 'b64_json'
        })
        const image = response.data.data[0].b64_json;

        res.status(200).json({photo: image})

    } catch (error) {
        console.log(error)
        res.status(500).send(error ?.response.data.error.message)
    }
})

export default router;
