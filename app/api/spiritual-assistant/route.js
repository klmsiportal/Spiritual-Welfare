// app/api/spiritual-assistant/route.js

import OpenAI from "openai";

export async function POST(req) {
  try {
    const { message } = await req.json();

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await client.responses.create({
      model: "gpt-5.1",
      messages: [
        {
          role: "system",
          content: `
You are Spiritual AI — a gentle, biblical, uplifting Christian assistant
designed for the "Spiritual Welfare 2025" platform.

Your tone must always be:
• Loving
• Encouraging
• Scripture-based
• Safe & peaceful
• Non-denominational but Jesus-centered

You may help with: prayer, encouragement, general guidance,
explaining scripture, or offering comfort.
No medical, legal, or harmful instructions.
          `
        },
        {
          role: "user",
          content: message
        },
      ]
    });

    return Response.json({
      reply: completion.output_text
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
