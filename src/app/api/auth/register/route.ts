import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase, createUser, findUserByEmail } from '@/lib/db';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(18, 'You must be at least 18 years old').max(100, 'Age must be under 100')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = registerSchema.parse(body);
    
    await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await findUserByEmail(validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 12);

    // Create user with default preferences
    const userData = {
      email: validatedData.email.toLowerCase(),
      passwordHash,
      name: validatedData.name,
      age: validatedData.age,
      isProfileComplete: false,
      isQuestionnairComplete: false,
      preferences: {
        ageRange: {
          min: Math.max(18, validatedData.age - 10),
          max: Math.min(100, validatedData.age + 10)
        },
        maxDistance: 50,
        relationshipType: 'romantic' as const,
        genderPreference: [],
        compatibilityThreshold: 60
      },
      privacySettings: {
        showAge: true,
        showLocation: true,
        showLastActive: true,
        allowMessages: 'matches' as const,
        visibilityMode: 'public' as const
      }
    };

    const user = await createUser(userData);

    // Return success response (without sensitive data)
    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        age: user.age,
        isProfileComplete: user.isProfileComplete,
        isQuestionnairComplete: user.isQuestionnairComplete
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}