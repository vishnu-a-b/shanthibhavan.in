'use server';

import API_BASE_URL from '@/lib/api';

export async function getHomepageSettings() {
  try {
    const res = await fetch(`${API_BASE_URL}/homepage-settings`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error('Failed to fetch homepage settings:', res.status);
      return null;
    }
    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error('Failed to fetch homepage settings', error);
    return null;
  }
}

export async function updateHomepageSettings(data: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/homepage-settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update homepage settings');
    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error('Failed to update homepage settings', error);
    throw error;
  }
}

export async function seedHomepageSettings() {
  try {
    const res = await fetch(`${API_BASE_URL}/homepage-settings/seed`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to seed homepage settings');
    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error('Failed to seed homepage settings', error);
    throw error;
  }
}
