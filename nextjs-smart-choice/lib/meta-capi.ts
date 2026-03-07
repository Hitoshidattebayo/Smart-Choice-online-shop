import * as bizSdk from 'facebook-nodejs-business-sdk';

const EventRequest = bizSdk.EventRequest;
const UserData = bizSdk.UserData;
const ServerEvent = bizSdk.ServerEvent;
const CustomData = bizSdk.CustomData;

const access_token = process.env.META_ACCESS_TOKEN || '';
const pixel_id = process.env.META_PIXEL_ID || '';
const test_event_code = process.env.META_TEST_EVENT_CODE || '';

if (access_token) {
    bizSdk.FacebookAdsApi.init(access_token);
}

export interface MetaEventData {
    eventName: 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase';
    eventTime?: number;
    eventSourceUrl: string;
    userIp: string;
    userAgent: string;
    fbp?: string;
    fbc?: string;
    customData?: {
        currency?: string;
        value?: number;
        content_ids?: string[];
        content_name?: string;
        content_type?: string;
        contents?: { id: string; quantity: number }[];
    };
}

export const sendMetaEvent = async (data: MetaEventData) => {
    if (!access_token || !pixel_id) {
        console.warn('Meta CAPI is not configured. Missing access_token or pixel_id.');
        return;
    }

    const {
        eventName,
        eventSourceUrl,
        userIp,
        userAgent,
        fbp,
        fbc,
        customData,
    } = data;

    const userData = new UserData()
        .setClientIpAddress(userIp)
        .setClientUserAgent(userAgent);

    if (fbp) userData.setFbp(fbp);
    if (fbc) userData.setFbc(fbc);

    const serverEvent = new ServerEvent()
        .setEventName(eventName)
        .setEventTime(Math.floor(Date.now() / 1000))
        .setUserData(userData)
        .setEventSourceUrl(eventSourceUrl)
        .setActionSource('website');

    if (customData) {
        const metaCustomData = new CustomData();
        if (customData.currency) metaCustomData.setCurrency(customData.currency);
        if (customData.value !== undefined) metaCustomData.setValue(customData.value);
        if (customData.content_name) metaCustomData.setContentName(customData.content_name);
        if (customData.content_type) metaCustomData.setContentType(customData.content_type);
        if (customData.content_ids) metaCustomData.setContentIds(customData.content_ids);
        if (customData.contents) {
            metaCustomData.setContents(customData.contents.map(c => ({
                id: c.id,
                quantity: c.quantity,
            })));
        }
        serverEvent.setCustomData(metaCustomData);
    }

    const eventsData = [serverEvent];
    const eventRequest = new EventRequest(access_token, pixel_id).setEvents(eventsData);

    if (test_event_code) {
        eventRequest.setTestEventCode(test_event_code);
    }

    try {
        const response = await eventRequest.execute();
        console.log(`Successfully sent Meta event ${eventName}`, response);
        return response;
    } catch (error) {
        console.error(`Error sending Meta event ${eventName}:`, error);
    }
};
