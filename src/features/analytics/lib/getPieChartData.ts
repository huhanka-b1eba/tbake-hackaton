import {ChartConfig} from "@/shared/ui/chart";

type StorageDataType = {
    type: string;
    sum: number;
    category: string;
    date: string;
    comment: string | null;
}

const storageData: StorageDataType[] = JSON.parse(localStorage.getItem("STORAGE_KEY") as unknown as string) as unknown as StorageDataType[];

export const getTransactionsByMonth = (month: string, year: string): StorageDataType[] => {
    if (!storageData) return [];
    return storageData.filter((t) => {
        const dateParts = t.date.split('-');
        if (dateParts[1] === month && dateParts[2] === year) return t;
    });
}

const getCategorySpendingMap = (month: string, year: string): Map<string, number> => {
    const data = getTransactionsByMonth(month, year);
    const map = new Map<string, number>();
    for (const item of data) {
        if (item.date)
        if (!map.has(item.category)) {
            map.set(item.category, item.sum);
        } else {
            const prev = map.get(item.category);
            map.set(item.category, prev! + item.sum)
        }
    }

    return map;
}

export const getChartConfig = (month: string, year: string): { category: string, totalSum: number }[] => {
    const data = getCategorySpendingMap(month, year);
    const result = [];
    for (const [key, value] of data) {
        result.push({ category: key, totalSum: value });
    }

    return result;
}

export const chartDataMock = [
    { category: 'food', totalSum: 10000, fill: '#ABC' },
    { category: 'transport', totalSum: 5000, fill: '#FBF' },
    { category: 'books', totalSum: 3000, fill: '#FFC' },
    { category: 'other', totalSum: 7000, fill: '#BCA' },
]

export const chartConfigMock = {
    category: {
        label: "totalSum",
    },
    transport: {
        label: "transport",
        color: "#ABC",
    },
    books: {
        label: "books",
        color: "#FBF",
    },
    other: {
        label: "other",
        color: "#FFC",
    },
    food: {
        label: "food",
        color: "#BCA",
    }
} satisfies ChartConfig