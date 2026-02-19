
export interface BankInfo {
    code: string;
    nameEn: string;
    nameMn: string;
}

export const BANK_CODES: BankInfo[] = [
    { code: '010000', nameEn: 'Bank of Mongolia', nameMn: 'Монгол банк' },
    { code: '020000', nameEn: 'Capital bank', nameMn: 'Капитал банк' },
    { code: '040000', nameEn: 'Trade and Development bank of Mongolia', nameMn: 'Худалдаа хөгжлийн банк' },
    { code: '050000', nameEn: 'Khan bank', nameMn: 'Хаан банк' },
    { code: '150000', nameEn: 'Golomt bank', nameMn: 'Голомт банк' },
    { code: '190000', nameEn: 'Trans bank', nameMn: 'Тээвэр хөгжлийн банк' },
    { code: '210000', nameEn: 'Arig bank', nameMn: 'Ариг банк' },
    { code: '220000', nameEn: 'Credit bank', nameMn: 'Кредит банк' },
    { code: '290000', nameEn: 'NIB bank', nameMn: 'ҮХО банк' },
    { code: '300000', nameEn: 'Capitron bank', nameMn: 'Капитрон банк' },
    { code: '320000', nameEn: 'Xac bank', nameMn: 'Хас банк' },
    { code: '330000', nameEn: 'Chingiskhan bank', nameMn: 'Чингисхаан банк' },
    { code: '340000', nameEn: 'State bank', nameMn: 'Төрийн банк' },
    { code: '360000', nameEn: 'National Development bank', nameMn: 'Хөгжлийн банк' },
    { code: '380000', nameEn: 'Bogd bank', nameMn: 'Богд банк' },
    { code: '900000', nameEn: 'State fund', nameMn: 'Төрийн сан' },
    { code: '500000', nameEn: 'Mobi Finance', nameMn: 'Мобифинанс' },
    { code: '390000', nameEn: 'M bank', nameMn: 'М банк' },
    { code: '993000', nameEn: 'Invescore', nameMn: 'Инвэскор ББСБ' },
    { code: '100000', nameEn: 'Test bank', nameMn: 'Тест банк' },
    { code: 'TOKI', nameEn: 'Toki app', nameMn: 'Токи' }
];

export const getBankName = (code: string, lang: 'en' | 'mn' = 'mn'): string | undefined => {
    const bank = BANK_CODES.find(b => b.code === code);
    return bank ? (lang === 'en' ? bank.nameEn : bank.nameMn) : undefined;
};
