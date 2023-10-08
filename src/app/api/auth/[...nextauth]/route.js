import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../../../../../prisma/db";
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      console.log("session callback", user);
      if (session?.user) {
        session.user.id = user.id;
      }
      const existingSettings = await prisma.settings.findUnique({
        where: { userId: user.id },
      });
      if (!existingSettings) {
        const lastName = user.name.split(" ").pop();
        await prisma.settings.create({
          data: {
            userId: user.id,
            emailRecipients: [],
            emailSubject: `${lastName} Training Log - `,
            includeDateInSubject: true,
            digitsToRound: 0,
            mileageRoundThreshold: "0.5",
          },
        });
      }
      return session;
    },
    jwt: async ({ token, user }) => {
      console.log("jwt callback", user);
    },
  },
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/",
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
