const groq = require('../config/groqClient');
const Trip = require('../models/Trip');
const Itinerary = require('../models/Itinerary');

exports.generateItinerary = async (req, res) => {
  const { destination, startDate, endDate, budget, currency, travelers, interests, travelStyle, additionalNotes } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const systemPrompt = `You are the Traveloop AI expert travel planner. You must respond in valid JSON only, without any markdown formatting, backticks, or extra text. Your output must strictly follow this exact JSON schema:
{
  "tripTitle": "string",
  "destination": "string",
  "totalDays": "number",
  "estimatedTotalCost": "number",
  "currency": "string",
  "travelStyle": "string",
  "summary": "string",
  "highlights": ["string"],
  "days": [
    {
      "day": "number",
      "date": "string (YYYY-MM-DD)",
      "title": "string",
      "location": "string",
      "activities": [
        {
          "time": "string (HH:MM AM/PM)",
          "name": "string",
          "type": "string (sightseeing|food|adventure|culture|relaxation|transport|accommodation)",
          "description": "string",
          "estimatedCost": "number",
          "duration": "number (in hours)",
          "tips": "string"
        }
      ],
      "dailyBudget": "number",
      "accommodation": {
        "name": "string",
        "type": "string",
        "estimatedCost": "number",
        "notes": "string"
      },
      "transport": "string"
    }
  ],
  "budgetBreakdown": {
    "accommodation": "number",
    "food": "number",
    "activities": "number",
    "transport": "number",
    "miscellaneous": "number"
  },
  "packingEssentials": ["string"],
  "travelTips": ["string"],
  "bestTimeToVisit": "string",
  "localCurrency": "string",
  "emergencyContacts": {
    "police": "string",
    "ambulance": "string",
    "touristHelpline": "string"
  }
}`;

  const userPrompt = `Create a detailed day-by-day itinerary for a trip to ${destination}.
Dates: ${startDate} to ${endDate}.
Budget: ${budget} ${currency}.
Travelers: ${travelers}.
Interests: ${interests?.join(', ')}.
Travel Style: ${travelStyle}.
Additional Notes: ${additionalNotes || 'None'}.`;

  try {
    const stream = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 8000,
      temperature: 0.7,
      stream: true,
      response_format: { type: 'json_object' }
    });

    let fullResponse = '';

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ chunk: content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true, full: fullResponse })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Groq API Error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};

exports.saveAiItinerary = async (req, res) => {
  try {
    const { aiItinerary } = req.body;
    
    // Create Trip
    const newTrip = await Trip.create({
      user: req.user._id,
      title: aiItinerary.tripTitle,
      description: aiItinerary.summary,
      startDate: new Date(aiItinerary.days[0].date),
      endDate: new Date(aiItinerary.days[aiItinerary.days.length - 1].date),
      destinations: [aiItinerary.destination],
      totalBudget: aiItinerary.estimatedTotalCost,
      status: 'upcoming',
      isPublic: false
    });

    // Create Itinerary
    const sections = aiItinerary.days.map(day => {
      const dayDate = new Date(day.date);
      return {
        title: `Day ${day.day} — ${day.title}`,
        description: day.location,
        budget: day.dailyBudget,
        dateRange: { start: dayDate, end: dayDate },
        activities: day.activities.map(act => {
          let mappedType = 'activity';
          const t = act.type ? act.type.toLowerCase() : 'activity';
          if (t === 'accommodation' || t === 'hotel') mappedType = 'hotel';
          else if (t === 'flight') mappedType = 'flight';
          else if (t === 'food') mappedType = 'food';
          else if (t === 'transport') mappedType = 'transport';
          else if (t === 'sightseeing') mappedType = 'sightseeing';

          return {
            name: act.name || 'Activity',
            type: mappedType,
            date: dayDate,
            time: act.time,
            cost: act.estimatedCost || 0,
            notes: act.description + (act.tips ? `\nTip: ${act.tips}` : '')
          };
        })
      };
    });

    await Itinerary.create({
      trip: newTrip._id,
      sections
    });

    res.status(201).json({ success: true, tripId: newTrip._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
