import { Configuration, OpenAIApi } from "openai";
import { NextApiRequest, NextApiResponse } from "next";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const connectOpenAI = async (req: NextApiRequest, res: NextApiResponse) => {
    const { prompt } = req.body;
    const openai = new OpenAIApi(configuration);

    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0,
        max_tokens: 300,
    });

    // const gptResponseMsg = response.data.choices[0].text;

    console.log(response.data);

    return res.json({ data: response.data });

    // const response = await openai.createCompletion({
    //     model: "code-davinci-002",
    //     prompt: "Use list comprehension to convert this into one line of JavaScript:\n\ndogs.forEach((dog) => {\n    car.push(dog);\n});\n\nJavaScript one line version:",
    //     temperature: 0,
    //     max_tokens: 60,
    //     top_p: 1.0,
    //     frequency_penalty: 0.0,
    //     presence_penalty: 0.0,
    //     stop: [";"],
    //   });
};

export default connectOpenAI;