import OpenAI from 'openai';

export default async function handler(req, res) {
  // --- ROBUST CORS HANDLING ---
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins for the MVP
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, task = 'chat' } = req.body;

    // Check environment variable
    if (!process.env.OPENAI_API_KEY) {
      console.error("Missing OPENAI_API_KEY environment variable");
      return res.status(500).json({ error: 'OpenAI API Key not configured in Vercel Settings' });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    let systemPrompt = `You are Spiritual AI, a gentle, biblical, uplifting Christian assistant for "Spiritual Welfare 2025".
    Tone: Loving, Encouraging, Scripture-based, Safe, Non-denominational but Jesus-centered.
    
    Guidelines:
    - Always answer with grace and wisdom.
    - Use King James Version (KJV) or NIV for scripture references unless asked otherwise.
    - If the user is distressed, offer comfort and prayer.
    - Do not give medical or legal advice.`;

    if (task === 'sermon') {
        systemPrompt += "\nTASK: You are an expert preacher. Create a structured sermon with a Title, Key Scripture, Introduction, 3 Main Points (with biblical backing), and a Conclusion/Altar Call.";
    } else if (task === 'prayer') {
        systemPrompt += "\nTASK: You are a prayer warrior. Write a powerful, faith-filled prayer based on the user's request. End with 'In Jesus' Name, Amen.'";
    } else if (task === 'bible_search') {
        systemPrompt += "\nTASK: You are a Biblical Concordance. Provide specific verses that match the user's emotion, situation, or query. Include the verse text and reference.";
    } else if (task === 'tv_recommend') {
        systemPrompt += "\nTASK: Recommend 3 specific gospel songs, worship artists, or channels that match the user's mood.";
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 1000, 
    });

    res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    // Return the actual error message to help debugging
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}