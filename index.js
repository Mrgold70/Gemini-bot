const mineflayer = require('mineflayer');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const bot = mineflayer.createBot({
  host: process.env.MC_HOST,
  port: parseInt(process.env.MC_PORT) || 25565,
  username: process.env.MC_USERNAME || 'GeminiBot',
  version: false
});

bot.on('spawn', () => {
  console.log('Bot server par successfully join ho gaya hai!');
  bot.chat('Hello everyone! Main Gemini AI hoon.');
});

bot.on('chat', async (username, message) => {
  if (username === bot.username) return;

  if (message.startsWith('!ai') || message.includes('gemini')) {
    try {
      const prompt = message.replace('!ai', '').replace('gemini', '').trim();
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const reply = response.text.trim();
      bot.chat(reply.substring(0, 100));
    } catch (err) {
      console.error(err);
      bot.chat('Sorry, mera dimag is waqt kaam nahi kar raha!');
    }
  }
});

bot.on('error', (err) => console.log('Error:', err));
bot.on('kicked', (reason) => console.log('Kicked:', reason));
