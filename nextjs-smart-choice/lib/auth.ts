import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID || "",
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials')
                }

                // Handle guest users
                if (credentials.email.startsWith('guest_')) {
                    const userId = credentials.email.replace('guest_', '').replace('@temp.local', '');
                    const user = await prisma.user.findUnique({
                        where: { id: userId }
                    });

                    if (user && user.isGuest) {
                        return {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            isGuest: user.isGuest,
                            guestNumber: user.guestNumber,
                        };
                    }
                    throw new Error('Invalid guest credentials');
                }

                // Handle regular users
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user || !user.password) {
                    throw new Error('Invalid credentials')
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if (!isCorrectPassword) {
                    throw new Error('Invalid credentials')
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    isGuest: user.isGuest || false,
                    guestNumber: user.guestNumber || null,
                }
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.isGuest = (user as any).isGuest;
                token.guestNumber = (user as any).guestNumber;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.isGuest = token.isGuest as boolean;
                session.user.guestNumber = token.guestNumber as string | null;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}
