import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/prisma/client";
import * as bcrypt from "bcrypt";
import NextAuth from "next-auth/next";
import { User } from "@prisma/client";
import { signIn } from "next-auth/react";

export const authOptions = {
  pages: {
    signIn: "/auth/signin",
  },
  session:{
    strategy:"jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error("User Not Found");
        }

        if (!user.emailVerified) {
          throw new Error("Please Verify your email first");
        }
        
        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        
        if (!isPasswordCorrect) {
          throw new Error("Incorrect Password");
        }
        
        const { password, ...userWithoutPass } = user;
        return userWithoutPass;
        
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: {
            id: user.id,
          },
        });
    
        if (dbUser) {
          const { password, ...userWithoutPass } = dbUser;
          token.user = userWithoutPass;
        }
      }
    
      return token;
    },
    async session({ token, session }) {
      session.user = token.user;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
