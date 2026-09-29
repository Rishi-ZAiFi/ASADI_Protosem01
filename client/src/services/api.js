/**
 * API Service for communicating with the CreatorSpace AI backend
 */

const API_BASE_URL = ''; // Relative path leverages Vite dev proxy to localhost:5000

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (error) {
    return { status: 'offline', error: error.message };
  }
}

export async function generateContent({
  topic,
  format,
  audience,
  tone,
  apiKey,
}) {
  const endpoint = `${API_BASE_URL}/api/gemini/generate`;

  const bodyPayload = {
    topic,
    format,
    audience,
    tone,
    apiKey,
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyPayload),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      const error = new Error(data.message || 'Generation failed.');
      error.code = data.error || 'SERVER_ERROR';
      error.details = data;
      throw error;
    }

    return data.data;
  } catch (error) {
    if (!error.code) {
      error.message =
        'Failed to connect to backend server. Make sure the CreatorSpace backend is running on port 5000.';
      error.code = 'NETWORK_ERROR';
    }
    throw error;
  }
}
