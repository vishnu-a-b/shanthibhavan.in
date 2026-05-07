'use server';

import API_BASE_URL from '@/lib/api';

export async function getHomeSections() {
  try {
    const res = await fetch(`${API_BASE_URL}/homepage/admin`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed: ${res.status}`);
    const data = await res.json();
    return data.sections || [];
  } catch (error) {
    console.error('Failed to fetch home sections', error);
    return [];
  }
}

export async function createHomeSection(data: any) {
  const res = await fetch(`${API_BASE_URL}/homepage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create section');
  return (await res.json()).section;
}

export async function updateHomeSection(id: string, data: any) {
  const res = await fetch(`${API_BASE_URL}/homepage/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update section');
  return (await res.json()).section;
}

export async function deleteHomeSection(id: string) {
  const res = await fetch(`${API_BASE_URL}/homepage/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete section');
  return { success: true };
}

export async function seedHomeSections() {
  const res = await fetch(`${API_BASE_URL}/homepage/seed`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to seed sections');
  return await res.json();
}
