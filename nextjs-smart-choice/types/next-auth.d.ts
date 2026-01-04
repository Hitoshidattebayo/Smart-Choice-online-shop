import 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            isGuest?: boolean;
            guestNumber?: string | null;
        };
    }

    interface User {
        id: string;
        name?: string | null;
        email?: string | null;
        isGuest?: boolean;
        guestNumber?: string | null;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        isGuest?: boolean;
        guestNumber?: string | null;
    }
}
