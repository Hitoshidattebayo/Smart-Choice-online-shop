
// QPay HTTP Status Codes
export const QPAY_STATUS_CODES = {
    SUCCESS: 200,
    VALIDATION_ERROR: 400,
    UNAUTHORIZED_ERROR: 401,
    FORBIDDEN_ERROR: 403,
    UNIQUE_ERROR: 409,
    NOT_FOUND_ERROR: 422,
    INTERNAL_ERROR: 500
};

// QPay Common Response Messages
export interface QPayMessage {
    code: string;
    messageMn: string;
    messageEn: string;
}

export const QPAY_MESSAGES: Record<string, QPayMessage> = {
    ACCOUNT_BANK_DUPLICATED: { code: 'ACCOUNT_BANK_DUPLICATED', messageMn: 'Банкны данс давхацсан байна', messageEn: 'Bank account is already registered!' },
    ACCOUNT_SELECTION_INVALID: { code: 'ACCOUNT_SELECTION_INVALID', messageMn: 'Дансны сонголт буруу', messageEn: 'Account selection is invalid!' },
    AUTHENTICATION_FAILED: { code: 'AUTHENTICATION_FAILED', messageMn: 'Нэвтрэх нэр нууц үг буруу', messageEn: 'Your username and password are wrong!' },
    BANK_ACCOUNT_NOTFOUND: { code: 'BANK_ACCOUNT_NOTFOUND', messageMn: 'Банкны данс олдсонгүй', messageEn: 'Bank account is not found!' },
    BANK_MCC_ALREADY_ADDED: { code: 'BANK_MCC_ALREADY_ADDED', messageMn: 'Банкны MCC кодыг нэмчихсэн байна', messageEn: 'Bank MCC is already added!' },
    BANK_MCC_NOT_FOUND: { code: 'BANK_MCC_NOT_FOUND', messageMn: 'Банкны MCC код олдсонгүй', messageEn: 'Bank MCC is not found!' },
    CARD_TERMINAL_NOTFOUND: { code: 'CARD_TERMINAL_NOTFOUND', messageMn: 'Картын терминал бүртгэлгүй байна', messageEn: 'Card terminal is not registered!' },
    CLIENT_NOTFOUND: { code: 'CLIENT_NOTFOUND', messageMn: 'Клиентийн бүртгэл олдсонгүй', messageEn: 'Client is not registered!' },
    CLIENT_USERNAME_DUPLICATED: { code: 'CLIENT_USERNAME_DUPLICATED', messageMn: 'Клиентийн хэрэглэгчийн нэр давхацсан', messageEn: 'Client username is already exist!' },
    CUSTOMER_DUPLICATE: { code: 'CUSTOMER_DUPLICATE', messageMn: 'Харилцагчийн регистрийн дугаар давхацсан байна!', messageEn: 'Customer register duplicated!' },
    CUSTOMER_NOTFOUND: { code: 'CUSTOMER_NOTFOUND', messageMn: 'Харилцагч бүртгэгдээгүй байна!', messageEn: 'Customer not registered!' },
    CUSTOMER_REGISTER_INVALID: { code: 'CUSTOMER_REGISTER_INVALID', messageMn: 'Харилцагч регистрийн дугаар байна!', messageEn: 'Customer register is wrong!' },
    EBARIMT_CANCEL_NOTSUPPERDED: { code: 'EBARIMT_CANCEL_NOTSUPPERDED', messageMn: 'qPay үйлчилгээ и-баримтыг цуцлах боломжгүй байна.', messageEn: 'qPay service eBarimt unregister function not supported' },
    EBARIMT_NOT_REGISTERED: { code: 'EBARIMT_NOT_REGISTERED', messageMn: 'и-Баримт үүсээгүй байна.', messageEn: 'eBarimt not registered!' },
    EBARIMT_QR_CODE_INVALID: { code: 'EBARIMT_QR_CODE_INVALID', messageMn: 'Төлбөр хүлээн авагчийн илгээсэн и-баримт-ын QR код буруу байна.', messageEn: 'eBarimt QR code invalid by merchant' },
    INFORM_NOTFOUND: { code: 'INFORM_NOTFOUND', messageMn: 'Мэдэгдэлийн хаяг олдсонгүй', messageEn: 'Inform is not found!' },
    INPUT_CODE_REGISTERED: { code: 'INPUT_CODE_REGISTERED', messageMn: 'Input code бүртгэгдсэн байна', messageEn: 'Input code is already registered!' },
    INPUT_NOTFOUND: { code: 'INPUT_NOTFOUND', messageMn: 'Input олдсонгүй', messageEn: 'Input is already registered!' },
    INVALID_AMOUNT: { code: 'INVALID_AMOUNT', messageMn: 'Үнийн дүн буруу', messageEn: 'Amount is invalid!' },
    INVALID_OBJECT_TYPE: { code: 'INVALID_OBJECT_TYPE', messageMn: 'object_type буруу', messageEn: 'Object type is invalid!' },
    INVOICE_ALREADY_CANCELED: { code: 'INVOICE_ALREADY_CANCELED', messageMn: 'Нэхэмжлэл цуцлагдсан байна', messageEn: 'Invoice is already cancelled!' },
    INVOICE_CODE_INVALID: { code: 'INVOICE_CODE_INVALID', messageMn: 'Нэхэмжлэлийн код буруу', messageEn: 'Invoice code is wrong!' },
    INVOICE_CODE_REGISTERED: { code: 'INVOICE_CODE_REGISTERED', messageMn: 'Нэхэмжлэлийн код бүртгэгдсэн байна', messageEn: 'Invoice code is already registered!' },
    INVOICE_LINE_REQUIRED: { code: 'INVOICE_LINE_REQUIRED', messageMn: 'Нэхэмжлэлийн мөр шаардлагатай', messageEn: 'Invoice line is required!' },
    INVOICE_NOTFOUND: { code: 'INVOICE_NOTFOUND', messageMn: 'Нэхэмжлэл олдсонгүй', messageEn: 'Invoice is not found!' },
    INVOICE_PAID: { code: 'INVOICE_PAID', messageMn: 'Нэхэмжлэл төлөгдсөн', messageEn: 'Invoice is paid!' },
    INVOICE_RECEIVER_DATA_ADDRESS_REQUIRED: { code: 'INVOICE_RECEIVER_DATA_ADDRESS_REQUIRED', messageMn: 'Нэхэмжлэл хүлээн авагчийн хаягийн мэдээлэл шаардлагатай', messageEn: 'Invoice receiver address is required!' },
    INVOICE_RECEIVER_DATA_EMAIL_REQUIRED: { code: 'INVOICE_RECEIVER_DATA_EMAIL_REQUIRED', messageMn: 'Нэхэмжлэл хүлээн авагчийн имэйл хаяг шаардлагатай', messageEn: 'Invoice receiver email is required!' },
    INVOICE_RECEIVER_DATA_PHONE_REQUIRED: { code: 'INVOICE_RECEIVER_DATA_PHONE_REQUIRED', messageMn: 'Нэхэмжлэл хүлээн авагчийн утасны дугаар шаардлагатай', messageEn: 'Invoice receiver phone is required!' },
    INVOICE_RECEIVER_DATA_REQUIRED: { code: 'INVOICE_RECEIVER_DATA_REQUIRED', messageMn: 'Нэхэмжлэл хүлээн авагчийн мэдээлэл шаардлагатай', messageEn: 'Invoice receiver data is required!' },
    MAX_AMOUNT_ERR: { code: 'MAX_AMOUNT_ERR', messageMn: 'Үнийн дүн хэт их байна', messageEn: 'Amount is over than max value!' },
    MCC_NOTFOUND: { code: 'MCC_NOTFOUND', messageMn: 'MCC код олдсонгүй', messageEn: 'MCC is not found!' },
    MERCHANT_ALREADY_REGISTERED: { code: 'MERCHANT_ALREADY_REGISTERED', messageMn: 'Мерчантын бүртгэл давхацсан', messageEn: 'Merchant is already registered!' },
    MERCHANT_INACTIVE: { code: 'MERCHANT_INACTIVE', messageMn: 'Мерчант идэвхигүй', messageEn: 'Merchant is inactive!' },
    MERCHANT_NOTFOUND: { code: 'MERCHANT_NOTFOUND', messageMn: 'Мерчант бүртгэлгүй байна', messageEn: 'Merchant is not registered!' },
    MIN_AMOUNT_ERR: { code: 'MIN_AMOUNT_ERR', messageMn: 'Үнийн дүн хэт бага байна', messageEn: 'Amount is less than minimum value!' },
    NO_CREDENDIALS: { code: 'NO_CREDENDIALS', messageMn: 'Хандах эрхгүй байна. Нэвтрэнэ үү.', messageEn: 'Your credential is invalid. Please login!' },
    OBJECT_DATA_ERROR: { code: 'OBJECT_DATA_ERROR', messageMn: 'object_data алдаа', messageEn: 'Object data is wrong!' },
    P2P_TERMINAL_NOTFOUND: { code: 'P2P_TERMINAL_NOTFOUND', messageMn: 'P2P терминал бүртгэлгүй байна', messageEn: 'P2P terminal is not registered!' },
    PAYMENT_ALREADY_CANCELED: { code: 'PAYMENT_ALREADY_CANCELED', messageMn: 'Төлбөр цуцлагдсан байна', messageEn: 'Payment is already cancelled!' },
    PAYMENT_NOT_PAID: { code: 'PAYMENT_NOT_PAID', messageMn: 'Төлбөр төлөлт хийгдээгүй байна', messageEn: 'Payment has not paid!' },
    PAYMENT_NOTFOUND: { code: 'PAYMENT_NOTFOUND', messageMn: 'Төлбөр олдсонгүй', messageEn: 'Payment is not found!' },
    PERMISSION_DENIED: { code: 'PERMISSION_DENIED', messageMn: 'Хандах эрх хүрэхгүй байна', messageEn: 'Your access permission is not allowed!' },
    QRACCOUNT_INACTIVE: { code: 'QRACCOUNT_INACTIVE', messageMn: 'QR данс идэвхигүй', messageEn: 'QR account is inactive!' },
    QRACCOUNT_NOTFOUND: { code: 'QRACCOUNT_NOTFOUND', messageMn: 'QR данс олдсонгүй', messageEn: 'QR account is not found!' },
    QRCODE_NOTFOUND: { code: 'QRCODE_NOTFOUND', messageMn: 'QR код олдсонгүй', messageEn: 'QR code is not found!' },
    QRCODE_USED: { code: 'QRCODE_USED', messageMn: 'QR код ашиглагдаж байна', messageEn: 'QR code is already used!' },
    SENDER_BRANCH_DATA_REQUIRED: { code: 'SENDER_BRANCH_DATA_REQUIRED', messageMn: 'Илгээгчийн салбарын мэдээлэл шаардлагатай', messageEn: 'Sender branch data is required!' },
    TAX_LINE_REQUIRED: { code: 'TAX_LINE_REQUIRED', messageMn: 'Татварын мөр шаардлагатай', messageEn: 'Tax line is required!' },
    TAX_PRODUCT_CODE_REQUIRED: { code: 'TAX_PRODUCT_CODE_REQUIRED', messageMn: 'Татварын бүтээгдэхүүний код шаардлагатай', messageEn: 'Tax product code is required!' },
    TRANSACTION_NOT_APPROVED: { code: 'TRANSACTION_NOT_APPROVED', messageMn: 'Гүйлгээний мөр зөвшөөрөгдөөгүй байна', messageEn: 'Transaction line is not approved!' },
    TRANSACTION_REQUIRED: { code: 'TRANSACTION_REQUIRED', messageMn: 'Гүйлгээний мөр шаардлагатай байна', messageEn: 'Transaction line is required!' },
    // Status Codes as Text
    VALIDATION_ERROR: { code: 'VALIDATION_ERROR', messageMn: 'Параметр буруу илгээсэн үед гарах алдаа', messageEn: 'Validation Error' },
    UNAUTHORIZED_ERROR: { code: 'UNAUTHORIZED_ERROR', messageMn: 'Нэвтрэлгүй дуудсан үед гарах алдаа', messageEn: 'Unauthorized Error' },
    FORBIDDEN_ERROR: { code: 'FORBIDDEN_ERROR', messageMn: 'Хандах эрх хүрээгүй үед гарах алдаа', messageEn: 'Forbidden Error' },
    UNIQUE_ERROR: { code: 'UNIQUE_ERROR', messageMn: 'Бүртгэлийн мэдээлэл давхацсан үед гарах алдаа', messageEn: 'Unique Error' },
    NOT_FOUND_ERROR: { code: 'NOT_FOUND_ERROR', messageMn: 'Мэдээлэл олдоогүй үед гарах алдаа', messageEn: 'Not Found Error' },
    INTERNAL_ERROR: { code: 'INTERNAL_ERROR', messageMn: 'Системийн дотоод алдаа', messageEn: 'Internal Error' }
};

export const getQPayMessage = (key: string, lang: 'en' | 'mn' = 'mn'): string => {
    const msg = QPAY_MESSAGES[key];
    if (msg) return lang === 'en' ? msg.messageEn : msg.messageMn;
    return key; // Return key if not found
};
