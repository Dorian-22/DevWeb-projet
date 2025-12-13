// src/services/registration-service.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function handleResponse(response) {
  if (!response.ok) {
    let msg = 'Request failed';
    try {
      const data = await response.json();
      if (data?.error) msg = data.error;
    } catch (_) {}
    const err = new Error(msg);
    err.status = response.status;
    throw err;
  }
  
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function getAuthHeaders() {
 
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function registerToEvent(eventId) {
  const res = await fetch(`${API_URL}/events/${eventId}/register`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function fetchMyRegistrations() {
  const res = await fetch(`${API_URL}/me/registrations`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function fetchEventRegistrationsAdmin(eventId) {
  const res = await fetch(`${API_URL}/admin/events/${eventId}/registrations`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function unregisterFromEvent(eventId) {
  const res = await fetch(`${API_URL}/events/${eventId}/register`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}
