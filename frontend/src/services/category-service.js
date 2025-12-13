// src/services/category-service.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = 'Request failed';
    try {
      const data = await response.json();
      if (data && data.error) {
        errorMessage = data.error;
      }
    } catch (_) {}
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

export async function fetchCategories() {
  const response = await fetch(`${API_URL}/categories`);
  return handleResponse(response);
}

// Fonctions admin 
export async function adminCreateCategory(payload) {
  const response = await fetch(`${API_URL}/admin/categories`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

export async function adminUpdateCategory(id, payload) {
  const response = await fetch(`${API_URL}/admin/categories/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}