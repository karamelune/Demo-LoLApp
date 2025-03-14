/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChampionStats } from '@/types/championStats';
import { TableCell, TableRow } from './ui/table';
import championKeyToId from '@/data/championKeyToId.json';
import Image from 'next/image';
import Link from 'next/link';

const ddragonBaseUrl = process.env.DDRAGON_BASE_URL;

type Params = {
    index: number;
    championStats: ChampionStats;
};

export default function ChampionsStatsRow({ index, championStats }: Params) {
    // Ensure championStats and championStats.championKey are not null
    const championId =
        championStats && championStats.championKey
            ? championKeyToId.find(
                  (champ) => champ.key === championStats.championKey.toString()
              )?.id
            : 'Unknown';

    const mostPlayedRole =
        championStats.stats.ranked?.mostPlayedRole ?? 'Unknown';
    const mostPlayedRoleWR =
        championStats.stats.ranked?.roles[mostPlayedRole]?.winRate ?? 0;

    // Calculate the champions with the highest win rate against this champion, only if +5 matches
    const counteredBy = Object.entries(
        championStats.stats.ranked.againstChampions
    )
        .filter(([_, stats]) => stats.matchesNumber > 5 && stats.winRate > 50)
        .sort((a, b) => b[1].winRate - a[1].winRate)
        .slice(0, 3)
        .map(([championKey, { championId, matchesNumber, winRate }]) => {
            return { championId, matchesNumber, winRate };
        });

    return (
        <>
            <TableRow>
                <TableCell className="text-center">{index}</TableCell>
                <TableCell className="flex gap-1 justify-start items-center">
                    <Link href={`/champions/${championId}`}>
                        <Image
                            src={`${ddragonBaseUrl}img/champion/${championId}.png`}
                            width={40}
                            height={40}
                            alt="Champion icon"
                            loading="lazy"
                            className="rounded-full"
                        />
                    </Link>
                    <p className="text-xs">{championStats.championName}</p>
                </TableCell>
                <TableCell className="text-center">{mostPlayedRole}</TableCell>
                <TableCell className="text-center">
                    {mostPlayedRoleWR}%
                </TableCell>
                <TableCell className="text-center">Pick rate</TableCell>
                <TableCell className="text-center">Ban rate</TableCell>
                <TableCell className="flex gap-1 justify-center items-center">
                    {counteredBy.map(
                        ({ championId, matchesNumber, winRate }) => (
                            <div key={championId}>
                                <Link href={`/champions/${championId}`}>
                                    <Image
                                        src={`${ddragonBaseUrl}img/champion/${championId}.png`}
                                        width={40}
                                        height={40}
                                        alt="Champion icon"
                                        title={`${winRate}% win rate in ${matchesNumber} matches`}
                                        loading="lazy"
                                        className="rounded-full"
                                    />
                                </Link>
                            </div>
                        )
                    )}
                </TableCell>
            </TableRow>
        </>
    );
}
