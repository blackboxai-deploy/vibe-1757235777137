import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { findUserByEmail } from './db';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await findUserByEmail(credentials.email);
          
          if (!user || !user.passwordHash) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );

          if (!isPasswordValid) {
            return null;
          }

          // Update last active timestamp
          user.lastActive = new Date();
          await user.save();

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.profileImage || null,
            isProfileComplete: user.isProfileComplete || false,
            isQuestionnairComplete: user.isQuestionnairComplete || false
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isProfileComplete = user.isProfileComplete;
        token.isQuestionnairComplete = user.isQuestionnairComplete;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isProfileComplete = token.isProfileComplete as boolean;
        session.user.isQuestionnairComplete = token.isQuestionnairComplete as boolean;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key'
};

export default NextAuth(authOptions);