'use server'
import mongoose from "mongoose";
import dbConnect from "@/lib/connectDb";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(req) {

  await dbConnect();
  const JWT_SECRET = process.env.JWT_SECRET;

  try {
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    console.log(user)
    if (!user) {
      console.log('user not found')
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    console.log("still proceeded")

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return NextResponse.json({ message: 'Incorrect email or password' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'User Logged In successfully',
      token
    }, { status: 200 });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
