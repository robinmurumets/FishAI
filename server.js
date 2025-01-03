import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.post('/api/proxy', async (req, res) => {
    try {
      const { conversation } = req.body;
  
      const response = await fetch('https://api.openai.com/v1/chat/completions', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: conversation,
          temperature: 0,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API Error: ${errorText}`);
        return res.status(response.status).json({ error: errorText });
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Server Error:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
