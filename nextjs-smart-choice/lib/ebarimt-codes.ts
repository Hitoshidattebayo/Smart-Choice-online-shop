
// EBarimt Tax Type Codes
export const EBARIMT_TAX_TYPE = {
    VATABLE: '1',     // НӨАТ тооцогдох бүтээгдэхүүн (10%)
    ZERO_VAT: '2',    // НӨАТ-гүй бүтээгдэхүүн (0%)
    EXEMPT: '3'       // НӨАТ-аас чөлөөлөгдөх бүтээгдэхүүн
};

// EBarimt Code References for 0% VAT Goods/Services (Tax Type 2)
// "Цахим төлбөрийн баримтын систем дэх НӨАТ-ын 0 хувь хэрэглэх бараа"
export const EBARIMT_ZERO_VAT_CODES = {
    EXPORT_GOODS: '501',
    INTL_TRANSPORT: '502',
    SERVICES_OUTSIDE_MN: '503',
    SERVICES_TO_NON_RESIDENT: '504',
    INTL_FLIGHT_SERVICES: '505',
    GOVT_MEDALS_NOTES: '506',
    MINING_END_PRODUCTS: '507'
};

// EBarimt Code References for VAT Exemption Goods/Services (Tax Type 3)
// "Цахим төлбөрийн баримтын систем дэх НӨАТ-аас чөлөөлөгдөх барааны код"
export const EBARIMT_EXEMPT_CODES = {
    DISABLED_EQUIPMENT: '305',
    AIRCRAFT_PARTS: '307',
    RESIDENTIAL_PROPERTY: '308',
    MEDICAL_PRODUCTS: '310',
    GAS_FUEL_EQUIPMENT: '311',
    GOLD_SALES: '313',
    RESEARCH_PRODUCTS: '315',
    SECURITIES_ASSETS: '316', // Note: Corrected code from user list (40 is separate entry but code is 316)
    AGRICULTURE_PRODUCE: '318',
    MEAT_PRODUCTS: '319',
    DAIRY_PRODUCTS: '320',

    // Services
    CURRENCY_EXCHANGE: '401',
    BANKING_SERVICES: '402',
    INSURANCE: '403',
    SECURITIES: '404',
    LOAN_SERVICES: '405',
    SOCIAL_INSURANCE_INTEREST: '406',
    FINANCIAL_INTEREST: '407',
    RESIDENTIAL_RENTAL: '408',
    EDUCATION: '409',
    HEALTHCARE: '410',
    RELIGIOUS_SERVICES: '411',
    GOVT_SERVICES: '412',
    PUBLIC_TRANSPORT: '413',
    TOURISM: '414',
    SME_EQUIPMENT: '419',
    EXPORTED_MINERALS: '421',
    INNOVATION_MATERIALS: '423',
    EXPORTED_RAW_MATERIALS: '425',
    CULTURE_RESTORE_MATERIALS: '426',
    OIL_PRODUCTS: '428',
    FREE_ZONE_GOODS: '429',
    CULTURE_RESTORE_SERVICES: '430',
    FUNERAL_SERVICES: '431',
    RENEWABLE_ENERGY_EQUIPMENT: '433',
    AGRICULTURE_EQUIPMENT: '434',
    VETERINARY_SERVICES: '436',
    NOTARY_SERVICES: '437',
    SECURITIES_MARKET: '438',
    IMPROVED_FUEL: '439',
    FUTURE_HERITAGE_FUND: '443',
    INNOVATION_PRODUCTS: '444',
    VIRTUAL_ASSETS: '445',
    HERDER_SALES: '447'
};
