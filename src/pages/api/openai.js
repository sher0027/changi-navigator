// import { Configuration, OpenAIApi } from 'openai';

// const openai = new OpenAIApi(new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
// }));

// export default async function handler(req, res) {
//     const { message } = req.body;

//     try {
//         const response = await openai.createCompletion({
//             model: "text-davinci-003",
//             prompt: message,
//             max_tokens: 150,
//         });

//         const reply = response.data.choices[0].text.trim();
//         res.status(200).json({ message: reply });
//     } catch (error) {
//         console.error('OpenAI API error:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// }
