'use server'; // Directive indicating server-side execution

import mongoose from "mongoose";
import dbConnect from "@/lib/connectDb";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Your existing POST function for login
export async function POST(req) {

  await dbConnect(); // Ensure database connection
  const JWT_SECRET = process.env.JWT_SECRET; // Get secret from environment variables

  try {
    const { email, password } = await req.json(); // Parse request body

    // Find user by email
    const user = await User.findOne({ email });
    console.log(user); // Log user found (or null)
    if (!user) {
      console.log('user not found');
      return NextResponse.json({ message: 'User not found' }, { status: 404 }); // User not found response
    }
    console.log("still proceeded"); // Log progress

    // Compare provided password with stored hash
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return NextResponse.json({ message: 'Incorrect email or password' }, { status: 401 }); // Invalid credentials response
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email }, // Payload
      JWT_SECRET, // Secret key
      { expiresIn: '7d' } // Token expiration
    );

    // Successful login response
    return NextResponse.json({
      message: 'User Logged In successfully',
      token // Include the token in the response
    }, { status: 200 });

  } catch (error) {
    console.error('API error:', error); // Log any errors
    // Generic error response
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// New GET function to just show "hi"
export async function GET(req) {
  // No database interaction or complex logic needed for this simple endpoint.
  try {
    // Return a simple JSON response with status 200 OK
    return NextResponse.json({ message: "hi" }, { status: 200 });
  } catch (error) {
    // Basic error handling in case something unexpected happens
    console.error('GET request error:', error);
    return NextResponse.json({ error: 'Something went wrong during GET' }, { status: 500 });
  }
}