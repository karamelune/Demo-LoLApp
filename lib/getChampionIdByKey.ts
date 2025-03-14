import championKeyToIdData from '@/data/championKeyToId.json';

// Transform the array into an object
const championKeyToId = championKeyToIdData.reduce((acc, champion) => {
    acc[Number(champion.key)] = { id: champion.id };
    return acc;
}, {} as Record<number, { id: string }>);

export default function getChampionIdByKey(championKey: number): string | null {
    championKey = Number(championKey);
    const champion = championKeyToId[championKey];
    if (champion) {
        return champion.id;
    } else {
        console.error(
            `Champion key ${championKey} not found in championKeyToId.json`
        );
        return null;
    }
}
