import { NextResponse } from 'next/server';
import API_BASE_URL from '@/lib/api';

export async function POST() {
  try {
    const response = await fetch(`${API_BASE_URL}/services/seed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || 'Failed to seed services' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error seeding services:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reach backend seed endpoint' },
      { status: 500 }
    );
  }
}
