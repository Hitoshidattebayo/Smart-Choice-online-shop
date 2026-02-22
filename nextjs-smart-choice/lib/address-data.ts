
export type Province = {
    id: string;
    name: string;
    districts: District[];
};

export type District = {
    id: string;
    name: string;
    khoroos: string[]; // Just numbers or names like "1-r khoroo"
};

// Helper to format legacy address strings to use full Mongolian names
export const formatAddress = (addressStr: string | null | undefined): string => {
    if (!addressStr) return '';
    let formatted = addressStr;

    // Replace known legacy province IDs
    for (const province of MONGOLIA_DATA) {
        if (formatted.includes(province.id) && province.id !== province.name) {
            formatted = formatted.replace(new RegExp(`\\b${province.id}\\b`, 'g'), province.name);
        }
    }

    // Replace known legacy district abbreviations
    const legacyMap: Record<string, string> = {
        "BGD": "Баянгол дүүрэг",
        "BZD": "Баянзүрх дүүрэг",
        "SBD": "Сүхбаатар дүүрэг",
        "SHD": "Сонгинохайрхан дүүрэг",
        "HUD": "Хан-Уул дүүрэг",
        "CHD": "Чингэлтэй дүүрэг",
        "ND": "Налайх дүүрэг",
        "BND": "Багануур дүүрэг",
        "BHD": "Багахангай дүүрэг"
    };
    for (const [key, value] of Object.entries(legacyMap)) {
        if (formatted.includes(key)) {
            formatted = formatted.replace(new RegExp(`\\b${key}\\b`, 'g'), value);
        }
    }

    return formatted;
};

// Helper to generate khoroo list
const generateKhoroos = (count: number) => {
    return Array.from({ length: count }, (_, i) => `${i + 1}-р хороо`);
};

// Helper to generate bag list for province soums
const generateBags = (count: number) => {
    return Array.from({ length: count }, (_, i) => `${i + 1}-р баг`);
};

export const MONGOLIA_DATA: Province[] = [
    {
        id: "Ulaanbaatar",
        name: "Улаанбаатар хот",
        districts: [
            { id: "Баянгол дүүрэг", name: "Баянгол дүүрэг", khoroos: generateKhoroos(34) },
            { id: "Баянзүрх дүүрэг", name: "Баянзүрх дүүрэг", khoroos: generateKhoroos(43) },
            { id: "Сүхбаатар дүүрэг", name: "Сүхбаатар дүүрэг", khoroos: generateKhoroos(20) },
            { id: "Сонгинохайрхан дүүрэг", name: "Сонгинохайрхан дүүрэг", khoroos: generateKhoroos(43) },
            { id: "Хан-Уул дүүрэг", name: "Хан-Уул дүүрэг", khoroos: generateKhoroos(25) },
            { id: "Чингэлтэй дүүрэг", name: "Чингэлтэй дүүрэг", khoroos: generateKhoroos(24) },
            { id: "Налайх дүүрэг", name: "Налайх дүүрэг", khoroos: generateKhoroos(8) },
            { id: "Багануур дүүрэг", name: "Багануур дүүрэг", khoroos: generateKhoroos(5) },
            { id: "Багахангай дүүрэг", name: "Багахангай дүүрэг", khoroos: generateKhoroos(2) },
        ]
    },
    {
        id: "Arkhangai",
        name: "Архангай",
        districts: [
            { id: "Их тамир", name: "Их тамир", khoroos: [] },
            { id: "Чулуут", name: "Чулуут", khoroos: [] },
            { id: "Хангай", name: "Хангай", khoroos: [] },
            { id: "Тариат", name: "Тариат", khoroos: [] },
            { id: "Өндөр-Улаан", name: "Өндөр-Улаан", khoroos: [] },
            { id: "Эрдэнэмандал", name: "Эрдэнэмандал", khoroos: [] },
            { id: "Жаргалант", name: "Жаргалант", khoroos: [] },
            { id: "Цэцэрлэг", name: "Цэцэрлэг", khoroos: [] },
            { id: "Хайрхан", name: "Хайрхан", khoroos: [] },
            { id: "Батцэнгэл", name: "Батцэнгэл", khoroos: [] },
            { id: "Өлзийт", name: "Өлзийт", khoroos: [] },
            { id: "Өгийнуур", name: "Өгийнуур", khoroos: [] },
            { id: "Хашаат", name: "Хашаат", khoroos: [] },
            { id: "Хотонт", name: "Хотонт", khoroos: [] },
            { id: "Цэнхэр", name: "Цэнхэр", khoroos: [] },
            { id: "Төвшрүүлэх", name: "Төвшрүүлэх", khoroos: [] },
            { id: "Булган", name: "Булган", khoroos: [] },
            { id: "Цахир", name: "Цахир", khoroos: [] },
            { id: "Эрдэнэбулган", name: "Эрдэнэбулган", khoroos: [] }
        ]
    },
    {
        id: "Bayan-Ulgii",
        name: "Баян-Өлгий",
        districts: [
            { id: "Алтай", name: "Алтай", khoroos: [] },
            { id: "Алтанцөгц", name: "Алтанцөгц", khoroos: [] },
            { id: "Баяннуур", name: "Баяннуур", khoroos: [] },
            { id: "Бугат", name: "Бугат", khoroos: [] },
            { id: "Булган", name: "Булган", khoroos: [] },
            { id: "Буянт", name: "Буянт", khoroos: [] },
            { id: "Дэлүүн", name: "Дэлүүн", khoroos: [] },
            { id: "Ногооннуур", name: "Ногооннуур", khoroos: [] },
            { id: "Сагсай", name: "Сагсай", khoroos: [] },
            { id: "Толбо", name: "Толбо", khoroos: [] },
            { id: "Улаанхус", name: "Улаанхус", khoroos: [] },
            { id: "Цэнгэл", name: "Цэнгэл", khoroos: [] },
            { id: "Өлгий", name: "Өлгий", khoroos: [] }
        ]
    },
    {
        id: "Bayankhongor",
        name: "Баянхонгор",
        districts: [
            { id: "Баацагаан", name: "Баацагаан", khoroos: [] },
            { id: "Баянбулаг", name: "Баянбулаг", khoroos: [] },
            { id: "Баянговь", name: "Баянговь", khoroos: [] },
            { id: "Баянлиг", name: "Баянлиг", khoroos: [] },
            { id: "Баян-Овоо", name: "Баян-Овоо", khoroos: [] },
            { id: "Баян-Өндөр", name: "Баян-Өндөр", khoroos: [] },
            { id: "Баянцагаан", name: "Баянцагаан", khoroos: [] },
            { id: "Богд", name: "Богд", khoroos: [] },
            { id: "Бөмбөгөр", name: "Бөмбөгөр", khoroos: [] },
            { id: "Бууцагаан", name: "Бууцагаан", khoroos: [] },
            { id: "Галуут", name: "Галуут", khoroos: [] },
            { id: "Гурванбулаг", name: "Гурванбулаг", khoroos: [] },
            { id: "Жаргалант", name: "Жаргалант", khoroos: [] },
            { id: "Жинст", name: "Жинст", khoroos: [] },
            { id: "Заг", name: "Заг", khoroos: [] },
            { id: "Өлзийт", name: "Өлзийт", khoroos: [] },
            { id: "Хүрээмарал", name: "Хүрээмарал", khoroos: [] },
            { id: "Шинэжинст", name: "Шинэжинст", khoroos: [] },
            { id: "Эрдэнэцогт", name: "Эрдэнэцогт", khoroos: [] },
            { id: "Баянхонгор", name: "Баянхонгор", khoroos: [] }
        ]
    },
    {
        id: "Bulgan",
        name: "Булган",
        districts: [
            { id: "Сайхан", name: "Сайхан", khoroos: [] },
            { id: "Тэшиг", name: "Тэшиг", khoroos: [] },
            { id: "Хутаг-Өндөр", name: "Хутаг-Өндөр", khoroos: [] },
            { id: "Баян-Агт", name: "Баян-Агт", khoroos: [] },
            { id: "Баяннуур", name: "Баяннуур", khoroos: [] },
            { id: "Бугат", name: "Бугат", khoroos: [] },
            { id: "Бүрэгхангай", name: "Бүрэгхангай", khoroos: [] },
            { id: "Гурван Булаг", name: "Гурван Булаг", khoroos: [] },
            { id: "Дашинчилэн", name: "Дашинчилэн", khoroos: [] },
            { id: "Могод", name: "Могод", khoroos: [] },
            { id: "Орхон", name: "Орхон", khoroos: [] },
            { id: "Сэлэнгэ", name: "Сэлэнгэ", khoroos: [] },
            { id: "Хангал", name: "Хангал", khoroos: [] },
            { id: "Рашаант", name: "Рашаант", khoroos: [] },
            { id: "Хишиг-Өндөр", name: "Хишиг-Өндөр", khoroos: [] },
            { id: "Булган", name: "Булган", khoroos: [] },
            { id: "Өлзийт", name: "Өлзийт", khoroos: [] },
            { id: "Хялганат", name: "Хялганат", khoroos: [] }
        ]
    },
    {
        id: "Govi-Altai",
        name: "Говь-Алтай",
        districts: [
            { id: "Алтай", name: "Алтай", khoroos: [] },
            { id: "Баян-Уул", name: "Баян-Уул", khoroos: [] },
            { id: "Бигэр", name: "Бигэр", khoroos: [] },
            { id: "Бугат", name: "Бугат", khoroos: [] },
            { id: "Жаргалан", name: "Жаргалан", khoroos: [] },
            { id: "Дарив", name: "Дарив", khoroos: [] },
            { id: "Дэлгэр", name: "Дэлгэр", khoroos: [] },
            { id: "Тайшир", name: "Тайшир", khoroos: [] },
            { id: "Тонхил", name: "Тонхил", khoroos: [] },
            { id: "Төгрөг", name: "Төгрөг", khoroos: [] },
            { id: "Халиун", name: "Халиун", khoroos: [] },
            { id: "Хөхморьт", name: "Хөхморьт", khoroos: [] },
            { id: "Цогт", name: "Цогт", khoroos: [] },
            { id: "Цээл", name: "Цээл", khoroos: [] },
            { id: "Чандмань", name: "Чандмань", khoroos: [] },
            { id: "Шарга", name: "Шарга", khoroos: [] },
            { id: "Эрдэнэ", name: "Эрдэнэ", khoroos: [] },
            { id: "Есөнбулаг", name: "Есөнбулаг", khoroos: [] }
        ]
    },
    {
        id: "Dornogovi",
        name: "Дорноговь",
        districts: [
            { id: "Айраг", name: "Айраг", khoroos: [] },
            { id: "Алтанширээ", name: "Алтанширээ", khoroos: [] },
            { id: "Даланжаргалан", name: "Даланжаргалан", khoroos: [] },
            { id: "Дэлгэрэх", name: "Дэлгэрэх", khoroos: [] },
            { id: "Иххэт", name: "Иххэт", khoroos: [] },
            { id: "Мандах", name: "Мандах", khoroos: [] },
            { id: "Өргөн", name: "Өргөн", khoroos: [] },
            { id: "Сайхандулаан", name: "Сайхандулаан", khoroos: [] },
            { id: "Улаанбадрах", name: "Улаанбадрах", khoroos: [] },
            { id: "Хатанбулаг", name: "Хатанбулаг", khoroos: [] },
            { id: "Хөвсгөл", name: "Хөвсгөл", khoroos: [] },
            { id: "Эрдэнэ", name: "Эрдэнэ", khoroos: [] },
            { id: "Замын-Үүд", name: "Замын-Үүд", khoroos: [] },
            { id: "Сайншанд", name: "Сайншанд", khoroos: [] }
        ]
    },
    {
        id: "Dornod",
        name: "Дорнод",
        districts: [
            { id: "Баян-Уул", name: "Баян-Уул", khoroos: [] },
            { id: "Баяндун", name: "Баяндун", khoroos: [] },
            { id: "Баянтүмэн", name: "Баянтүмэн", khoroos: [] },
            { id: "Гурванзагал", name: "Гурванзагал", khoroos: [] },
            { id: "Дашбалбар", name: "Дашбалбар", khoroos: [] },
            { id: "Матад", name: "Матад", khoroos: [] },
            { id: "Хөлөнбуйр", name: "Хөлөнбуйр", khoroos: [] },
            { id: "Булган", name: "Булган", khoroos: [] },
            { id: "Сэргэлэн", name: "Сэргэлэн", khoroos: [] },
            { id: "Халхгол", name: "Халхгол", khoroos: [] },
            { id: "Цагаан-Овоо", name: "Цагаан-Овоо", khoroos: [] },
            { id: "Чулуунхороот", name: "Чулуунхороот", khoroos: [] },
            { id: "Чойбалсан", name: "Чойбалсан", khoroos: [] },
            { id: "Хэрлэн", name: "Хэрлэн", khoroos: [] }
        ]
    },
    {
        id: "Dundgovi",
        name: "Дундговь",
        districts: [
            { id: "Адаацаг", name: "Адаацаг", khoroos: [] },
            { id: "Баянжаргалан", name: "Баянжаргалан", khoroos: [] },
            { id: "Говь-Угтаал", name: "Говь-Угтаал", khoroos: [] },
            { id: "Дэлгэрцогт", name: "Дэлгэрцогт", khoroos: [] },
            { id: "Дэрэн", name: "Дэрэн", khoroos: [] },
            { id: "Гурвансайхан", name: "Гурвансайхан", khoroos: [] },
            { id: "Дэлгэрхангай", name: "Дэлгэрхангай", khoroos: [] },
            { id: "Луус", name: "Луус", khoroos: [] },
            { id: "Сайнцагаан", name: "Сайнцагаан", khoroos: [] },
            { id: "Сайхан-Овоо", name: "Сайхан-Овоо", khoroos: [] },
            { id: "Өлзийт", name: "Өлзийт", khoroos: [] },
            { id: "Өндөршил", name: "Өндөршил", khoroos: [] },
            { id: "Хулд", name: "Хулд", khoroos: [] },
            { id: "Цагаандэлгэр", name: "Цагаандэлгэр", khoroos: [] },
            { id: "Эрдэнэдалай", name: "Эрдэнэдалай", khoroos: [] }
        ]
    },
    {
        id: "Zavkhan",
        name: "Завхан",
        districts: [
            { id: "Алдархаан", name: "Алдархаан", khoroos: [] },
            { id: "Асгат", name: "Асгат", khoroos: [] },
            { id: "Баянтэс", name: "Баянтэс", khoroos: [] },
            { id: "Баянхайрхан", name: "Баянхайрхан", khoroos: [] },
            { id: "Тосонцэнгэл", name: "Тосонцэнгэл", khoroos: [] },
            { id: "Дөрвөлжин", name: "Дөрвөлжин", khoroos: [] },
            { id: "Идэр", name: "Идэр", khoroos: [] },
            { id: "Их-Уул", name: "Их-Уул", khoroos: [] },
            { id: "Нөмрөг", name: "Нөмрөг", khoroos: [] },
            { id: "Отгон", name: "Отгон", khoroos: [] },
            { id: "Сантмаргац", name: "Сантмаргац", khoroos: [] },
            { id: "Сонгино", name: "Сонгино", khoroos: [] },
            { id: "Түдэвтэй", name: "Түдэвтэй", khoroos: [] },
            { id: "Тэс", name: "Тэс", khoroos: [] },
            { id: "Тэлмэн", name: "Тэлмэн", khoroos: [] },
            { id: "Улиастай", name: "Улиастай", khoroos: [] },
            { id: "Цагаанхайрхан", name: "Цагаанхайрхан", khoroos: [] },
            { id: "Цагаанчулуут", name: "Цагаанчулуут", khoroos: [] },
            { id: "Цэцэн-Уул", name: "Цэцэн-Уул", khoroos: [] },
            { id: "Шилүүстэй", name: "Шилүүстэй", khoroos: [] },
            { id: "Эрдэнэхайрхан", name: "Эрдэнэхайрхан", khoroos: [] },
            { id: "Яруу", name: "Яруу", khoroos: [] },
            { id: "Завханмандал", name: "Завханмандал", khoroos: [] },
            { id: "Ургамал", name: "Ургамал", khoroos: [] }
        ]
    },
    {
        id: "Ovorkhangai",
        name: "Өвөрхангай",
        districts: [
            { id: "Баян-Өндөр", name: "Баян-Өндөр", khoroos: [] },
            { id: "Бүрд", name: "Бүрд", khoroos: [] },
            { id: "Бат-Өлзий", name: "Бат-Өлзий", khoroos: [] },
            { id: "Баруунбаян-Улаан", name: "Баруунбаян-Улаан", khoroos: [] },
            { id: "Баянгол", name: "Баянгол", khoroos: [] },
            { id: "Гучин-Ус", name: "Гучин-Ус", khoroos: [] },
            { id: "Есөн зүйл", name: "Есөн зүйл", khoroos: [] },
            { id: "Өлзийт", name: "Өлзийт", khoroos: [] },
            { id: "Зүүнбаян-Улаан", name: "Зүүнбаян-Улаан", khoroos: [] },
            { id: "Хайрхандулаан", name: "Хайрхандулаан", khoroos: [] },
            { id: "Нарийнтээл", name: "Нарийнтээл", khoroos: [] },
            { id: "Сант", name: "Сант", khoroos: [] },
            { id: "Тарагт", name: "Тарагт", khoroos: [] },
            { id: "Төгрөг", name: "Төгрөг", khoroos: [] },
            { id: "Уянга", name: "Уянга", khoroos: [] },
            { id: "Богд", name: "Богд", khoroos: [] },
            { id: "Хужирт", name: "Хужирт", khoroos: [] },
            { id: "Хархорин", name: "Хархорин", khoroos: [] },
            { id: "Арвайхээр", name: "Арвайхээр", khoroos: [] }
        ]
    },
    {
        id: "Umnugovi",
        name: "Өмнөговь",
        districts: [
            { id: "Баяндалай", name: "Баяндалай", khoroos: [] },
            { id: "Баян-Овоо", name: "Баян-Овоо", khoroos: [] },
            { id: "Булган", name: "Булган", khoroos: [] },
            { id: "Гурвантэс", name: "Гурвантэс", khoroos: [] },
            { id: "Мандал-Овоо", name: "Мандал-Овоо", khoroos: [] },
            { id: "Манлай", name: "Манлай", khoroos: [] },
            { id: "Номгон", name: "Номгон", khoroos: [] },
            { id: "Ноён", name: "Ноён", khoroos: [] },
            { id: "Ханбогд", name: "Ханбогд", khoroos: [] },
            { id: "Ханхонгор", name: "Ханхонгор", khoroos: [] },
            { id: "Хүрмэн", name: "Хүрмэн", khoroos: [] },
            { id: "Сэврэй", name: "Сэврэй", khoroos: [] },
            { id: "Цогт-Овоо", name: "Цогт-Овоо", khoroos: [] },
            { id: "Цогтцэций", name: "Цогтцэций", khoroos: [] },
            { id: "Даланзадгад", name: "Даланзадгад", khoroos: [] }
        ]
    },
    {
        id: "Sukhbaatar",
        name: "Сүхбаатар",
        districts: [
            { id: "Асгат", name: "Асгат", khoroos: [] },
            { id: "Баяндэлгэр", name: "Баяндэлгэр", khoroos: [] },
            { id: "Дарьганга", name: "Дарьганга", khoroos: [] },
            { id: "Мөнххаан", name: "Мөнххаан", khoroos: [] },
            { id: "Наран", name: "Наран", khoroos: [] },
            { id: "Онгон", name: "Онгон", khoroos: [] },
            { id: "Сүхбаатар", name: "Сүхбаатар", khoroos: [] },
            { id: "Түвшинширээ", name: "Түвшинширээ", khoroos: [] },
            { id: "Түмэнцогт", name: "Түмэнцогт", khoroos: [] },
            { id: "Уулбаян", name: "Уулбаян", khoroos: [] },
            { id: "Халзан", name: "Халзан", khoroos: [] },
            { id: "Эрдэнэцагаан", name: "Эрдэнэцагаан", khoroos: [] },
            { id: "Баруун-Урт", name: "Баруун-Урт", khoroos: [] }
        ]
    },
    {
        id: "Selenge",
        name: "Сэлэнгэ",
        districts: [
            { id: "Сүхбаатар", name: "Сүхбаатар", khoroos: [] },
            { id: "Алтанбулаг", name: "Алтанбулаг", khoroos: [] },
            { id: "Цагааннуур", name: "Цагааннуур", khoroos: [] },
            { id: "Орхон", name: "Орхон", khoroos: [] },
            { id: "Шаамар", name: "Шаамар", khoroos: [] },
            { id: "Баруунбүрэн", name: "Баруунбүрэн", khoroos: [] },
            { id: "Сант", name: "Сант", khoroos: [] },
            { id: "Орхонтуул", name: "Орхонтуул", khoroos: [] },
            { id: "Ерөө", name: "Ерөө", khoroos: [] },
            { id: "Зүүнбүрэн", name: "Зүүнбүрэн", khoroos: [] },
            { id: "Баянгол", name: "Баянгол", khoroos: [] },
            { id: "Хушаат", name: "Хушаат", khoroos: [] },
            { id: "Мандал", name: "Мандал", khoroos: [] },
            { id: "Жавхлант", name: "Жавхлант", khoroos: [] },
            { id: "Сайхан", name: "Сайхан", khoroos: [] },
            { id: "Түшиг", name: "Түшиг", khoroos: [] },
            { id: "Хүдэр", name: "Хүдэр", khoroos: [] }
        ]
    },
    {
        id: "Tuv",
        name: "Төв",
        districts: [
            { id: "Алтанбулаг", name: "Алтанбулаг", khoroos: [] },
            { id: "Аргалант", name: "Аргалант", khoroos: [] },
            { id: "Архуст", name: "Архуст", khoroos: [] },
            { id: "Батсүмбэр", name: "Батсүмбэр", khoroos: [] },
            { id: "Баян", name: "Баян", khoroos: [] },
            { id: "Баян-Өнжүүл", name: "Баян-Өнжүүл", khoroos: [] },
            { id: "Баяндэлгэр", name: "Баяндэлгэр", khoroos: [] },
            { id: "Баянжаргалан", name: "Баянжаргалан", khoroos: [] },
            { id: "Баянхангай", name: "Баянхангай", khoroos: [] },
            { id: "Баянчандмань", name: "Баянчандмань", khoroos: [] },
            { id: "Баянцагаан", name: "Баянцагаан", khoroos: [] },
            { id: "Баянцогт", name: "Баянцогт", khoroos: [] },
            { id: "Борнуур", name: "Борнуур", khoroos: [] },
            { id: "Бүрэн", name: "Бүрэн", khoroos: [] },
            { id: "Дэлгэрхаан", name: "Дэлгэрхаан", khoroos: [] },
            { id: "Жаргалант", name: "Жаргалант", khoroos: [] },
            { id: "Заамар", name: "Заамар", khoroos: [] },
            { id: "Лүн", name: "Лүн", khoroos: [] },
            { id: "Мөнгөнморьт", name: "Мөнгөнморьт", khoroos: [] },
            { id: "Өндөрширээт", name: "Өндөрширээт", khoroos: [] },
            { id: "Сэргэлэн", name: "Сэргэлэн", khoroos: [] },
            { id: "Сүмбэр", name: "Сүмбэр", khoroos: [] },
            { id: "Угтаалцайдам", name: "Угтаалцайдам", khoroos: [] },
            { id: "Цээл", name: "Цээл", khoroos: [] },
            { id: "Эрдэнэ", name: "Эрдэнэ", khoroos: [] },
            { id: "Эрдэнэсант", name: "Эрдэнэсант", khoroos: [] },
            { id: "Зуунмод", name: "Зуунмод", khoroos: [] }
        ]
    },
    {
        id: "Uvs",
        name: "Увс",
        districts: [
            { id: "Баруунтуруун", name: "Баруунтуруун", khoroos: [] },
            { id: "Бөхмөрөн", name: "Бөхмөрөн", khoroos: [] },
            { id: "Давст", name: "Давст", khoroos: [] },
            { id: "Завхан", name: "Завхан", khoroos: [] },
            { id: "Зүүнговь", name: "Зүүнговь", khoroos: [] },
            { id: "Зүүнхангай", name: "Зүүнхангай", khoroos: [] },
            { id: "Малчин", name: "Малчин", khoroos: [] },
            { id: "Наранбулаг", name: "Наранбулаг", khoroos: [] },
            { id: "Өлгий", name: "Өлгий", khoroos: [] },
            { id: "Өмнөговь", name: "Өмнөговь", khoroos: [] },
            { id: "Өндөрхангай", name: "Өндөрхангай", khoroos: [] },
            { id: "Сагил", name: "Сагил", khoroos: [] },
            { id: "Тариалан", name: "Тариалан", khoroos: [] },
            { id: "Түргэн", name: "Түргэн", khoroos: [] },
            { id: "Тэс", name: "Тэс", khoroos: [] },
            { id: "Ховд", name: "Ховд", khoroos: [] },
            { id: "Хяргас", name: "Хяргас", khoroos: [] },
            { id: "Цагаанхайрхан", name: "Цагаанхайрхан", khoroos: [] },
            { id: "Улаангом", name: "Улаангом", khoroos: [] }
        ]
    },
    {
        id: "Khovd",
        name: "Ховд",
        districts: [
            { id: "Алтай", name: "Алтай", khoroos: [] },
            { id: "Булган", name: "Булган", khoroos: [] },
            { id: "Буянт", name: "Буянт", khoroos: [] },
            { id: "Дарви", name: "Дарви", khoroos: [] },
            { id: "Дуут", name: "Дуут", khoroos: [] },
            { id: "Дөргөн", name: "Дөргөн", khoroos: [] },
            { id: "Зэрэг", name: "Зэрэг", khoroos: [] },
            { id: "Манхан", name: "Манхан", khoroos: [] },
            { id: "Мөст", name: "Мөст", khoroos: [] },
            { id: "Мянгад", name: "Мянгад", khoroos: [] },
            { id: "Мөнххайрхан", name: "Мөнххайрхан", khoroos: [] },
            { id: "Үенч", name: "Үенч", khoroos: [] },
            { id: "Ховд", name: "Ховд", khoroos: [] },
            { id: "Цэцэг", name: "Цэцэг", khoroos: [] },
            { id: "Чандмань", name: "Чандмань", khoroos: [] },
            { id: "Эрдэнэбүрэн", name: "Эрдэнэбүрэн", khoroos: [] },
            { id: "Жаргалант", name: "Жаргалант", khoroos: [] }
        ]
    },
    {
        id: "Khuvsgul",
        name: "Хөвсгөл",
        districts: [
            { id: "Алаг-Эрдэнэ", name: "Алаг-Эрдэнэ", khoroos: [] },
            { id: "Арбулаг", name: "Арбулаг", khoroos: [] },
            { id: "Баянзүрх", name: "Баянзүрх", khoroos: [] },
            { id: "Бүрэнтогтох", name: "Бүрэнтогтох", khoroos: [] },
            { id: "Галт", name: "Галт", khoroos: [] },
            { id: "Жаргалант", name: "Жаргалант", khoroos: [] },
            { id: "Их-Уул", name: "Их-Уул", khoroos: [] },
            { id: "Рашаант", name: "Рашаант", khoroos: [] },
            { id: "Рэнчинлхүмбэ", name: "Рэнчинлхүмбэ", khoroos: [] },
            { id: "Тариалан", name: "Тариалан", khoroos: [] },
            { id: "Тосонцэнгэл", name: "Тосонцэнгэл", khoroos: [] },
            { id: "Төмөрбулаг", name: "Төмөрбулаг", khoroos: [] },
            { id: "Түнэл", name: "Түнэл", khoroos: [] },
            { id: "Улаан-Уул", name: "Улаан-Уул", khoroos: [] },
            { id: "Ханх", name: "Ханх", khoroos: [] },
            { id: "Цагаан-Уул", name: "Цагаан-Уул", khoroos: [] },
            { id: "Цагаан-Үүр", name: "Цагаан-Үүр", khoroos: [] },
            { id: "Цагааннуур", name: "Цагааннуур", khoroos: [] },
            { id: "Цэцэрлэг", name: "Цэцэрлэг", khoroos: [] },
            { id: "Чандмань-Өндөр", name: "Чандмань-Өндөр", khoroos: [] },
            { id: "Шинэ-Идэр", name: "Шинэ-Идэр", khoroos: [] },
            { id: "Эрдэнэбулган", name: "Эрдэнэбулган", khoroos: [] },
            { id: "Мөрөн", name: "Мөрөн", khoroos: [] }
        ]
    },
    {
        id: "Khentii",
        name: "Хэнтий",
        districts: [
            { id: "Галшар", name: "Галшар", khoroos: [] },
            { id: "Баянхутаг", name: "Баянхутаг", khoroos: [] },
            { id: "Баянмөнх", name: "Баянмөнх", khoroos: [] },
            { id: "Дархан", name: "Дархан", khoroos: [] },
            { id: "Дэлгэрхаан", name: "Дэлгэрхаан", khoroos: [] },
            { id: "Жаргалтхаан", name: "Жаргалтхаан", khoroos: [] },
            { id: "Цэнхэрмандал", name: "Цэнхэрмандал", khoroos: [] },
            { id: "Өмнөдэлгэр", name: "Өмнөдэлгэр", khoroos: [] },
            { id: "Батширээт", name: "Батширээт", khoroos: [] },
            { id: "Биндэр", name: "Биндэр", khoroos: [] },
            { id: "Баян-Адарга", name: "Баян-Адарга", khoroos: [] },
            { id: "Дадал", name: "Дадал", khoroos: [] },
            { id: "Норовлин", name: "Норовлин", khoroos: [] },
            { id: "Батноров", name: "Батноров", khoroos: [] },
            { id: "Баян-Овоо", name: "Баян-Овоо", khoroos: [] },
            { id: "Мөрөн", name: "Мөрөн", khoroos: [] },
            { id: "Хэрлэн", name: "Хэрлэн", khoroos: [] },
            { id: "Бор-Өндөр", name: "Бор-Өндөр", khoroos: [] }
        ]
    },
    {
        id: "Darkhan-Uul",
        name: "Дархан-Уул",
        districts: [
            { id: "Дархан", name: "Дархан", khoroos: [] },
            { id: "Шарын гол", name: "Шарын гол", khoroos: [] },
            { id: "Хонгор", name: "Хонгор", khoroos: [] },
            { id: "Орхон", name: "Орхон", khoroos: [] }
        ]
    },
    {
        id: "Orkhon",
        name: "Орхон",
        districts: [
            { id: "Баян-Өндөр", name: "Баян-Өндөр", khoroos: [] },
            { id: "Жаргалант", name: "Жаргалант", khoroos: [] }
        ]
    },
    {
        id: "Govisumber",
        name: "Говьсүмбэр",
        districts: [
            { id: "Сүмбэр", name: "Сүмбэр", khoroos: [] },
            { id: "Баянтал", name: "Баянтал", khoroos: [] },
            { id: "Шивээговь", name: "Шивээговь", khoroos: [] }
        ]
    }
];
