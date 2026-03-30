import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Visitor from '@/models/Visitor';

export async function POST() {
  try {
    await connectToDatabase();
    const doc = await Visitor.findOneAndUpdate(
      {},
      { $set: { count: 40000 } },
      { upsert: true, new: true }
    );
    return NextResponse.json({ success: true, count: doc.count });
  } catch (error) {
    console.error('Error seeding visitor count:', error);
    return NextResponse.json({ success: false, error: 'Failed to seed visitor count' }, { status: 500 });
  }
}
