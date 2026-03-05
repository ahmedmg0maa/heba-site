import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are "Ask Heba AI" — the intelligent assistant for Heba's personal brand platform. 
Heba is a professional coach and educator based in Egypt.

Your role is to:
- Answer questions about Heba's coaching services, courses, and books
- Guide visitors to the right resources based on their needs
- Encourage bookings and course enrollments where appropriate
- Be warm, supportive, and motivating

Key information:
- Coaching sessions: 60 min (1500 EGP) or 90 min (1800 EGP)
- Session types: Online meeting or phone call
- Working hours: 9 AM - 8 PM (not Friday/Saturday)
- Courses cover: mindset, confidence, emotional intelligence, personal development, leadership
- Books available for purchase on the platform
- Booking requires creating an account

Always respond in the same language the user writes in (Arabic or English).
Keep responses concise and helpful (2-4 sentences max unless detail is needed).
`;

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const messages = [
      ...history.slice(-6).map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 300,
      temperature: 0.8,
    });

    const reply = completion.choices[0]?.message?.content ?? "I'm sorry, I couldn't generate a response. Please try again.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      { reply: "I'm having trouble right now. Please try again or contact us directly." },
      { status: 200 }
    );
  }
}
