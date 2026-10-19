/**
 * MindHaven API Client for interacting with FastAPI backend.
 */

const API_BASE = '/api';

export async function analyzeLive(content) {
  const res = await fetch(`${API_BASE}/analyze-live`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error('Live analysis failed');
  return res.json();
}

export async function createEntry(entryData) {
  const res = await fetch(`${API_BASE}/entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entryData),
  });
  if (!res.ok) throw new Error('Failed to create journal entry');
  return res.json();
}

export async function getEntries(params = {}) {
  const query = new URLSearchParams();
  if (params.emotion) query.append('emotion', params.emotion);
  if (params.search) query.append('search', params.search);
  if (params.limit) query.append('limit', params.limit);

  const res = await fetch(`${API_BASE}/entries?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch entries');
  return res.json();
}

export async function getEntry(id) {
  const res = await fetch(`${API_BASE}/entries/${id}`);
  if (!res.ok) throw new Error('Failed to fetch entry');
  return res.json();
}

export async function deleteEntry(id) {
  const res = await fetch(`${API_BASE}/entries/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete entry');
  return res.json();
}

export async function getAnalyticsOverview() {
  const res = await fetch(`${API_BASE}/analytics/overview`);
  if (!res.ok) throw new Error('Failed to load analytics');
  return res.json();
}

export async function reframeThought(negative_thought, emotion = 'anxiety') {
  const res = await fetch(`${API_BASE}/coping/reframe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ negative_thought, emotion }),
  });
  if (!res.ok) throw new Error('Reframing failed');
  return res.json();
}
