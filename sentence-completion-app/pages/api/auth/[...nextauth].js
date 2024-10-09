// /pages/api/auth/[...nextauth].js

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Find the user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // If user exists and password matches
        if (user && (await bcrypt.compare(credentials.password, user.password))) {
          // Return user object (id, username, email)
          return {
            id: user.id,
            username: user.username,
            email: user.email,
          };
        }

        // If authentication fails, throw an error
        throw new Error('Invalid email or password');
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // If user object is present, store user data in token
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      // If token is present, store user data in session
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
};

export default NextAuth(authOptions);
