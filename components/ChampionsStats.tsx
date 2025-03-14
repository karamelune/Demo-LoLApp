import { ChampionStats } from '@/types/championStats';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { getChampionsStats } from '@/scripts/getChampionsStats.client';
import { useEffect, useState } from 'react';
import ChampionsStatsRow from './ChampionsStatsRow';

export default function ChampionsStats() {
    const [championsStats, setChampionsStats] = useState<ChampionStats[]>([]);

    useEffect(() => {
        async function fetchChampionStats() {
            const data = await getChampionsStats();
            setChampionsStats(data.stats);
        }
        fetchChampionStats();
    }, []);

    return (
        <div>
            <Table>
                <TableHeader className="w-full">
                    <TableRow>
                        <TableHead className="w-[5%] text-center">
                            Rank
                        </TableHead>
                        <TableHead className="w-[15%] text-center">
                            Champion
                        </TableHead>
                        <TableHead className="w-[15%] text-center">
                            Role
                        </TableHead>
                        <TableHead className="w-[15%] text-center">
                            Win rate
                        </TableHead>
                        <TableHead className="w-[15%] text-center">
                            Pick rate
                        </TableHead>
                        <TableHead className="w-[15%] text-center">
                            Ban rate
                        </TableHead>
                        <TableHead className="w-[20%] text-center">
                            Countered by
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {championsStats.map((championStats) => (
                        <ChampionsStatsRow
                            key={championStats.championKey}
                            index={championsStats.indexOf(championStats) + 1}
                            championStats={championStats}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
