import championKeyToNameData from '@/data/championKeyToName.json';

// Transform the array into an object
const championKeyToName = championKeyToNameData.reduce((acc, champion) => {
    acc[Number(champion.key)] = { name: champion.name };
    return acc;
}, {} as Record<number, { name: string }>);

export default function getChampionNameByKey(
    championKey: number
): string | null {
    championKey = Number(championKey);
    const champion = championKeyToName[championKey];
    if (champion) {
        return champion.name;
    } else {
        console.error(
            `Champion key ${championKey} not found in championKeyToId.json`
        );
        return null;
    }
}
