import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const aiService = {
  generateItinerary: async (payload, onChunk, token) => {
    const response = await fetch(`${API_URL}/ai/generate-itinerary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Failed to generate itinerary');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let buffer = '';
    let fullText = '';

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.slice(6);
          if (!dataStr) continue;

          try {
            const data = JSON.parse(dataStr);
            if (data.error) {
              throw new Error(data.error);
            }
            if (data.chunk) {
              fullText += data.chunk;
              onChunk(fullText);
            }
            if (data.done) {
              const parsed = JSON.parse(data.full);
              return parsed;
            }
          } catch (e) {
            // Ignore partial JSON parse errors for chunks
          }
        }
      }
    }
  },
  saveItinerary: async (aiItinerary, token) => {
    const response = await fetch(`${API_URL}/ai/save-itinerary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ aiItinerary })
    });
    if (!response.ok) {
      throw new Error('Failed to save itinerary');
    }
    return response.json();
  }
};
