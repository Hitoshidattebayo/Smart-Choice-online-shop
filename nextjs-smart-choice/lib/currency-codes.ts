
export interface CurrencyInfo {
    code: string;
    nameMn: string;
}

export const CURRENCY_CODES: CurrencyInfo[] = [
    { code: 'MNT', nameMn: 'Төгрөг' },
    { code: 'USD', nameMn: 'Америк доллар' },
    { code: 'CNY', nameMn: 'Юань' },
    { code: 'JPY', nameMn: 'Иен' },
    { code: 'RUB', nameMn: 'Рубль' },
    { code: 'EUR', nameMn: 'Евро' }
];

export const getCurrencyName = (code: string): string | undefined => {
    const currency = CURRENCY_CODES.find(c => c.code === code);
    return currency?.nameMn;
};
