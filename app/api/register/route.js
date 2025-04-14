import { NextResponse } from 'next/server';
import connectDb from '@/lib/connectDb';
import User from '@/models/userModel';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  console.time('register-api')

  try {
    console.log('Connecting to DB...')
    await connectDb()
    console.timeLog('register-api', 'DB connected')

    const body = await req.json()
    console.timeLog('register-api', 'Body parsed')

    const {
      shopName,
      ownerName,
      email,
      password,
      location,
      category,
      phoneNumber,
    } = body;

    if (!shopName || !ownerName || !email || !password) {
      console.warn('Missing fields')
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.timeLog('register-api', 'Password hashed')

    const newUser = await User.create({
      shopName,
      ownerName,
      email,
      password: hashedPassword,
      location,
      category,
      phoneNumber,
    });

    console.timeEnd('register-api')
    return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
