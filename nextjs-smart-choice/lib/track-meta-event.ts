import { MetaEventData } from './meta-capi';

// Helper to get FBP and FBC from cookies
const getCookie = (name: string): string | undefined => {
    if (typeof document === 'undefined') return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
};

export const trackMetaEvent = async (
    eventName: MetaEventData['eventName'],
    customData?: MetaEventData['customData'],
    userData?: { email?: string; phone?: string }
) => {
    try {
        const fbp = getCookie('_fbp');
        const fbc = getCookie('_fbc');

        await fetch('/api/meta-events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventName,
                eventSourceUrl: window.location.href,
                fbp,
                fbc,
                email: userData?.email,
                phone: userData?.phone,
                customData,
            }),
        });
    } catch (error) {
        console.error(`Failed to track Meta event: ${eventName}`, error);
    }
};
