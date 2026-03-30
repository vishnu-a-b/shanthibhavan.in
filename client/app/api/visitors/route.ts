import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Visitor from '@/models/Visitor';

// GET — return current visitor count
export async function GET() {
  try {
    await connectToDatabase();
    const doc = await Visitor.findOne();
    return NextResponse.json({ count: doc?.count ?? 0 });
  } catch (error) {
    console.error('Error fetching visitor count:', error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}

// POST — increment visitor count and return new value
export async function POST() {
  try {
    await connectToDatabase();
    const doc = await Visitor.findOneAndUpdate(
      {},
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
    return NextResponse.json({ count: doc.count });
  } catch (error) {
    console.error('Error incrementing visitor count:', error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
