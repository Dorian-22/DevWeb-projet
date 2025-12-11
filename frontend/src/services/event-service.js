// src/services/event-service.js

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = 'Request failed';
    try {
      const data = await response.json();
      if (data && data.error) {
        errorMessage = data.error;
      }
    } catch (_) {
      // ignore JSON parse error
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export async function fetchEvents() {
  const response = await fetch(`${API_URL}/events`);
  return handleResponse(response);
}

export async function fetchEventById(id) {
  const response = await fetch(`${API_URL}/events/${id}`);
  return handleResponse(response);
}
