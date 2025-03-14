'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { Participant } from '@/types/match';
import Link from 'next/link';
import championKeyToId from '@/data/championKeyToId.json';

interface MatchParticipantRowProps {
    participant: Participant;
    gameDuration: number;
    key: string;
}

export default function MatchParticipantRow(
    participant: MatchParticipantRowProps
) {
    const p = participant.participant;
    const ddragonBaseUrl = process.env.DDRAGON_BASE_URL;
    const playerCs =
        (p?.totalMinionsKilled ?? 0) + (p?.neutralMinionsKilled ?? 0);
    const csPerMin = playerCs / (participant.gameDuration / 60);

    // Find champion name from champion key
    const champion = championKeyToId.find(
        (champ) => champ.key === p.championId.toString()
    );

    return (
        <TableRow
            key={p.puuid}
            className={`${
                p.win === true
                    ? 'bg-green-400/40 hover:bg-green-400/30'
                    : 'bg-red-400/40 hover:bg-red-400/30'
            }  border-0 text-gray-200`}>
            {/* Champion image and level */}
            <TableCell>
                <Image
                    src={`${ddragonBaseUrl}img/champion/${champion?.id}.png`}
                    width={40}
                    height={40}
                    alt={p.championName}
                    title={p.championName}
                    className="rounded-full shadow-md w-10 h-10"
                />
                <p
                    className={`bg-lolblue6 text-gray-200 px-1 border-2 ${
                        p.win === true
                            ? 'border-green-400/80'
                            : 'border-red-400/80'
                    } rounded-lg text-xs shadow-md text-center`}>
                    {p.champLevel}
                </p>
            </TableCell>
            <TableCell>
                <div className="grid grid-cols-2 gap-1 w-12">
                    {/* Summoner spells */}
                    <div className="rounded-sm overflow-hidden shadow-md">
                        <Image
                            src={`/summoner-spells/${p.summoner1Id}.png`}
                            width={20}
                            height={20}
                            alt="Summoner spell"
                        />
                    </div>
                    <div className="rounded-sm overflow-hidden shadow-md">
                        <Image
                            src={`/summoner-spells/${p.summoner2Id}.png`}
                            width={20}
                            height={20}
                            alt="Summoner spell"
                        />
                    </div>
                    {/* Runes */}
                    <Image
                        src={`/runes/${p.perks.styles[0].selections[0].perk}.png`}
                        width={20}
                        height={20}
                        alt="Rune"
                        className="self-center"
                    />
                    <Image
                        src={`/runes/${p.perks.styles[1].style}.png`}
                        width={18}
                        height={18}
                        alt="Rune"
                        className="self-center"
                    />
                </div>
            </TableCell>
            {/* Summoner name */}
            <TableCell className="text-center">
                <Link href={`/summoner/${p.riotIdGameName}/${p.riotIdTagline}`}>
                    {p.riotIdGameName}
                </Link>
            </TableCell>
            {/* KDA */}
            <TableCell>
                <p className="text-gray-200 text-center">
                    <span className="text-green-400">{p.kills}</span>/
                    <span className="text-red-400">{p.deaths}</span>/
                    <span className="text-blue-400">{p.assists}</span>
                    <span className="text-lolgray1 text-xs">
                        {' '}
                        (
                        {(
                            (p.kills + p.assists) /
                            (p.deaths === 0 ? 1 : p.deaths)
                        ).toFixed(1)}
                        )
                    </span>
                </p>
            </TableCell>
            {/* Damage */}
            <TableCell className="text-center">
                {p.totalDamageDealtToChampions.toLocaleString()}
            </TableCell>
            {/* Vision */}
            <TableCell className="text-center">{p.wardsPlaced}</TableCell>
            {/* CS */}
            <TableCell className="text-center">
                {playerCs}{' '}
                <span className="text-lolgray1 text-xs">
                    ({csPerMin.toFixed(1)})
                </span>
            </TableCell>
            {/* Items */}
            <TableCell>
                <div className="flex gap-1">
                    {[p.item0, p.item1, p.item2, p.item3, p.item4, p.item5].map(
                        (item, index) => {
                            return item ? (
                                <div
                                    key={index}
                                    className="w-7 h-7 rounded-sm overflow-hidden shadow-md">
                                    <Image
                                        src={`${ddragonBaseUrl}img/item/${item}.png`}
                                        width={32}
                                        height={32}
                                        alt="Item"
                                    />
                                </div>
                            ) : (
                                <div
                                    key={index}
                                    className="w-7 h-7 rounded-sm bg-lolgray1/20 shadow-md"></div>
                            );
                        }
                    )}
                    {p.item6 ? (
                        <div className="w-7 h-7 rounded-sm overflow-hidden shadow-md">
                            <Image
                                src={`${ddragonBaseUrl}img/item/${p.item6}.png`}
                                width={32}
                                height={32}
                                alt="Item"
                            />
                        </div>
                    ) : (
                        <div className="w-7 h-7 rounded-sm bg-lolgray1/20 shadow-md"></div>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
}
