import axios from 'axios';

const QPAY_API_URL = process.env.QPAY_URL || 'https://merchant.qpay.mn/v2';
// For sandbox/test environment, use: 'https://merchant-sandbox.qpay.mn/v2'

interface QPayTokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
}

interface QPayInvoiceResponse {
    invoice_id: string;
    qr_text: string;
    qr_image: string;
    qPay_shortUrl: string;
    urls: {
        name: string;
        description: string;
        logo: string;
        link: string;
    }[];
}


interface QPayInvoiceTax {
    tax_code: string;
    description: string;
    amount: number;
    note: string;
}

interface QPayInvoiceLine {
    tax_product_code: string;
    line_description: string;
    line_quantity: string;
    line_unit_price: string;
    note: string;
    classification_code: string;
    taxes: QPayInvoiceTax[];
}

interface QPayCustomer {
    name?: string;
    email?: string;
    phone?: string;
}

interface QPayTransaction {
    transaction_bank_code?: string;
    account_bank_code?: string;
    account_bank_name?: string;
    account_number?: string;
    status: string;
    amount: string;
    currency: string;
    settlement_status: string;
    settlement_status_date?: string;
    card_type?: string;
    is_cross_border?: boolean;
    date?: string;
    transaction_date?: string;
    card_merchant_code?: string;
    card_terminal_code?: string;
    card_number?: string;
}

interface QPayPaymentRow {
    payment_id: string;
    payment_status: "NEW" | "FAILED" | "PAID" | "PARTIAL" | "REFUNDED";
    payment_amount: string;
    trx_fee: string;
    payment_currency: string;
    payment_wallet: string;
    payment_type: "P2P" | "CARD";
    object_type: "INVOICE" | "QR" | "ITEM";
    object_id: string;
    next_payment_date: string | null;
    next_payment_datetime: string | null;
    card_transactions: QPayTransaction[];
    p2p_transactions: QPayTransaction[];
}

interface QPayCheckResponse {
    count: number;
    paid_amount: number;
    rows: QPayPaymentRow[];
}

interface QPayListResponse {
    count: number;
    rows: QPayPaymentRow[];
}

interface QPayListOptions {
    object_type: 'MERCHANT' | 'INVOICE' | 'QR';
    object_id: string;
    start_date: string; // Format: YYYY-MM-DD HH:mm:ss
    end_date: string;   // Format: YYYY-MM-DD HH:mm:ss
    offset?: {
        page_number: number;
        page_limit: number;
    };
}

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export class QPayClient {
    public async ensureToken(): Promise<void> {
        await this.getAccessToken();
    }

    private async getAccessToken(): Promise<string> {
        // Return cached token if valid (with 5 min buffer)
        if (cachedToken && tokenExpiry && Date.now() < tokenExpiry - 5 * 60 * 1000) {
            return cachedToken;
        }

        const username = process.env.QPAY_USERNAME;
        const password = process.env.QPAY_PASSWORD;

        if (!username || !password) {
            throw new Error('QPAY_USERNAME and QPAY_PASSWORD must be set in env');
        }

        try {
            const auth = Buffer.from(`${username}:${password}`).toString('base64');
            const response = await axios.post<QPayTokenResponse>(
                `${QPAY_API_URL}/auth/token`,
                {},
                {
                    headers: {
                        Authorization: `Basic ${auth}`,
                    },
                }
            );

            cachedToken = response.data.access_token;
            // Set expiry based on response (expires_in is a timestamp in seconds)
            tokenExpiry = response.data.expires_in * 1000;

            return cachedToken;
        } catch (error) {
            console.error('Failed to get QPay access token', error);
            throw error;
        }
    }

    async createInvoice(
        orderId: string,
        amount: number,
        description: string,
        customer?: QPayCustomer,
        ebarimt?: {
            taxType: string;
            districtCode: string; // e.g., '0101'
            lines: QPayInvoiceLine[];
        }
    ) {
        const token = await this.getAccessToken();
        const invoiceCode = ebarimt
            ? (process.env.QPAY_EBARIMT_INVOICE_CODE || process.env.QPAY_INVOICE_CODE || 'TEST_INVOICE')
            : (process.env.QPAY_INVOICE_CODE || 'TEST_INVOICE');
        try {
            const payload: any = {
                invoice_code: invoiceCode,
                sender_invoice_no: orderId,
                invoice_receiver_code: customer?.phone || 'terminal',
                invoice_description: description,
                sender_branch_code: process.env.QPAY_BRANCH_CODE || 'SALBAR1',
                amount: amount,
                callback_url: `${process.env.NEXTAUTH_URL}/api/payment/qpay/callback?payment_reference=${orderId}`,
                invoice_receiver_data: {
                    name: customer?.name || '',
                    email: customer?.email || '',
                    phone: customer?.phone || ''
                }
            };

            // Add EBarimt specific fields if provided
            if (ebarimt) {
                payload.tax_type = ebarimt.taxType;
                payload.district_code = ebarimt.districtCode;
                payload.lines = ebarimt.lines;
            }

            const response = await axios.post(
                `${QPAY_API_URL}/invoice`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data as QPayInvoiceResponse;
        } catch (error) {
            console.error('Failed to create QPay invoice', error);
            throw error;
        }
    }

    async checkInvoice(invoiceId: string): Promise<QPayCheckResponse> {
        const token = await this.getAccessToken();

        try {
            const response = await axios.post(
                `${QPAY_API_URL}/payment/check`,
                {
                    object_type: 'INVOICE',
                    object_id: invoiceId,
                    offset: {
                        page_number: 1,
                        page_limit: 100
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error('Failed to check QPay invoice', error);
            throw error;
        }
    }

    async cancelInvoice(invoiceId: string) {
        const token = await this.getAccessToken();
        try {
            const response = await axios.delete(
                `${QPAY_API_URL}/invoice/${invoiceId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data; // Expecting 200 Success or similar
        } catch (error) {
            console.error('Failed to cancel QPay invoice', error);
            throw error;
        }
    }

    async getPayment(paymentId: string): Promise<QPayPaymentRow> {
        const token = await this.getAccessToken();
        try {
            const response = await axios.get(
                `${QPAY_API_URL}/payment/${paymentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Failed to get QPay payment info', error);
            throw error;
        }
    }

    async cancelPayment(paymentId: string, note: string) {
        const token = await this.getAccessToken();
        try {
            // Endpoint: /payment/cancel/{payment_id}
            const response = await axios.delete(
                `${QPAY_API_URL}/payment/cancel/${paymentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    data: {
                        note: note
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Failed to cancel QPay payment', error);
            throw error;
        }
    }

    async refundPayment(paymentId: string, note: string) {
        const token = await this.getAccessToken();
        try {
            // Endpoint: /payment/refund/{payment_id} (Card Refund)
            const response = await axios.delete(
                `${QPAY_API_URL}/payment/refund/${paymentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    data: {
                        note: note
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Failed to refund QPay payment', error);
            throw error;
        }
    }

    async getPaymentList(options: QPayListOptions): Promise<QPayListResponse> {
        const token = await this.getAccessToken();
        try {
            const payload = {
                object_type: options.object_type,
                object_id: options.object_id,
                start_date: options.start_date,
                end_date: options.end_date,
                offset: options.offset || {
                    page_number: 1,
                    page_limit: 100
                }
            };

            const response = await axios.post(
                `${QPAY_API_URL}/payment/list`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Failed to get QPay payment list', error);
            throw error;
        }
    }

    async createEBarimt(
        paymentId: string,
        receiverType: 'CITIZEN' | 'COMPANY',
        receiverCode: string,
        districtCode?: string,
        classificationCode?: string
    ) {
        const token = await this.getAccessToken();
        try {
            const payload: any = {
                payment_id: paymentId,
                ebarimt_receiver_type: receiverType,
                ebarimt_receiver: receiverCode
            };

            if (districtCode) payload.district_code = districtCode;
            if (classificationCode) payload.classification_code = classificationCode;

            const response = await axios.post(
                `${QPAY_API_URL}/ebarimt_v3/create`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Failed to create QPay EBarimt', error);
            throw error;
        }
    }

    async getEBarimt(paymentId: string) {
        const token = await this.getAccessToken();
        try {
            const response = await axios.get(
                `${QPAY_API_URL}/ebarimt_v3/${paymentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Failed to get QPay EBarimt info', error);
            throw error;
        }
    }
}

export const qpay = new QPayClient();
