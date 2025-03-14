'use client';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MatchParticipantRow from './MatchParticipantRow';
import Image from 'next/image';
import { Sword } from 'lucide-react';
import { Match } from '@/types/match';

type MatchStatsProps = {
    matchData: Match;
    userPuuid: string;
};

// Get the base URL for the ddragon
const ddragonBaseUrl = process.env.DDRAGON_BASE_URL;

export default function MatchStats({ matchData, userPuuid }: MatchStatsProps) {
    // If the match data or the user puuid is not available, return null
    if (!matchData || !userPuuid) return null;

    // Get the participants for team 1
    const team1Participants = matchData.info.participants.filter(
        (participant) => participant.teamId === matchData.info.teams[0].teamId
    );

    // Get the total damage for team 1
    const team1TotalDamage = team1Participants.reduce((acc, participant) => {
        return acc + participant.totalDamageDealtToChampions;
    }, 0);

    // Get the damage percentages for each participant in team 1
    const team1DamagePercentages = team1Participants.map((participant) => {
        return {
            ...participant,
            damagePercentage: Math.ceil(
                (participant.totalDamageDealtToChampions / team1TotalDamage) *
                    100
            ),
        };
    });

    // Get the participants for team 2
    const team2Participants = matchData.info.participants.filter(
        (participant) => participant.teamId === matchData.info.teams[1].teamId
    );

    // Get the total damage for team 2
    const team2TotalDamage = team2Participants.reduce((acc, participant) => {
        return acc + participant.totalDamageDealtToChampions;
    }, 0);

    // Get the damage percentages for each participant in team 2
    const team2DamagePercentages = team2Participants.map((participant) => {
        return {
            ...participant,
            damagePercentage: Math.ceil(
                (participant.totalDamageDealtToChampions / team2TotalDamage) *
                    100
            ),
        };
    });

    // Get the color for the participant based on the team and the match result
    const getColorForParticipant = (
        riotIdGameName: string,
        team: 'team1' | 'team2'
    ) => {
        // Get the participants for the team
        const participants =
            team === 'team1' ? team1Participants : team2Participants;

        // Check if the team is the winning team
        const isWinningTeam =
            team === 'team1'
                ? matchData.info.teams[0].win
                : matchData.info.teams[1].win;

        // Set the base color based on the team
        const colorBase = isWinningTeam ? 'green' : 'red';

        // Find the index of the participant in the team
        const index = participants.findIndex(
            (p) => p.riotIdGameName === riotIdGameName
        );

        // Alternate between 800 and 600 based on the index
        const shade = index % 2 === 0 ? '500' : '400';

        return `bg-${colorBase}-${shade}/50`;
    };

    return (
        <div>
            {/* Contenu de la modale */}
            <Tabs defaultValue="overview">
                <TabsList className="bg-transparent p-0 m-0 text-gray-200">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="stats">Stats</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="flex flex-col">
                    <div className="flex items-center justify-center w-full h-[800px]">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow className="bg-lolgraycold/80  hover:bg-lolgraycold/80 border-b-transparent text-gray-200">
                                    <TableHead className="w-14"></TableHead>
                                    <TableHead></TableHead>
                                    <TableHead className="text-center">
                                        Summoner
                                    </TableHead>
                                    <TableHead className="text-center w-20">
                                        K/D/A
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Damage
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Wards
                                    </TableHead>
                                    <TableHead className="text-center w-12">
                                        CS
                                    </TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <MatchParticipantRow
                                                key={participant.puuid}
                                                participant={participant}
                                                gameDuration={
                                                    matchData.info.gameDuration
                                                }
                                            />
                                        );
                                    }
                                )}
                            </TableBody>
                        </Table>
                        {/* Team  damage participation */}
                        <div className="flex flex-col self-end h-[800px]">
                            <div className="bg-lolgraycold/80 w-7 h-[5%]"></div>
                            <div className="h-[47.5%] w-7 flex flex-col">
                                {team1DamagePercentages.map((participant) => (
                                    <div
                                        key={participant.riotIdGameName}
                                        className={`${getColorForParticipant(
                                            participant.riotIdGameName,
                                            'team1'
                                        )} w-7 flex justify-center items-center`}
                                        style={{
                                            height: `${participant.damagePercentage}%`,
                                        }}
                                        title={`${participant.riotIdGameName}: ${participant.damagePercentage}%`}>
                                        <Image
                                            src={`${ddragonBaseUrl}img/champion/${participant.championName}.png`}
                                            width={20}
                                            height={20}
                                            alt={participant.championName}
                                            className="rounded-full shadow-md w-6 h-6"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="h-[47.5%] w-7 flex flex-col">
                                {team2DamagePercentages.map((participant) => (
                                    <div
                                        key={participant.riotIdGameName}
                                        className={`${getColorForParticipant(
                                            participant.riotIdGameName,
                                            'team2'
                                        )} w-7 flex justify-center items-center`}
                                        style={{
                                            height: `${participant.damagePercentage}%`,
                                        }}
                                        title={`${participant.riotIdGameName}: ${participant.damagePercentage}%`}>
                                        <Image
                                            src={`${ddragonBaseUrl}img/champion/${participant.championName}.png`}
                                            width={20}
                                            height={20}
                                            alt={participant.championName}
                                            className="rounded-full shadow-md w-6 h-6"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="stats">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-lolgraycold/40 hover:bg-lolgraycold/30 border-b-lolgray2 text-gray-200">
                                <TableHead className="w-56"></TableHead>
                                {matchData.info.participants.map(
                                    (participant, index) => {
                                        return (
                                            <TableHead
                                                key={participant.puuid}
                                                className="p-2">
                                                <Image
                                                    src={`${ddragonBaseUrl}img/champion/${participant.championName}.png`}
                                                    width={40}
                                                    height={40}
                                                    alt={
                                                        participant.championName
                                                    }
                                                    title={
                                                        participant.championName
                                                    }
                                                    className={`rounded-full shadow-md w-10 h-10 border-2 ${
                                                        index <= 4
                                                            ? 'border-blue-600'
                                                            : 'border-red-600'
                                                    }`}
                                                />
                                            </TableHead>
                                        );
                                    }
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody className="text-gray-200">
                            {/* KDA */}
                            <TableRow className="border-0">
                                <TableCell>K/D/A</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                <p className="text-gray-200">
                                                    <span className="text-green-400">
                                                        {participant.kills}
                                                    </span>
                                                    /
                                                    <span className="text-red-400">
                                                        {participant.deaths}
                                                    </span>
                                                    /
                                                    <span className="text-blue-400">
                                                        {participant.assists}
                                                    </span>
                                                    <span className="text-lolgray1 text-xs"></span>
                                                </p>
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* Largest killing spree */}
                            <TableRow className="border-0">
                                <TableCell>Largest Killing Spree</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {
                                                    participant.largestKillingSpree
                                                }
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* Largest multi kill */}
                            <TableRow className="border-0">
                                <TableCell>Largest Multi Kill</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.largestMultiKill}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* Crowd control score */}
                            {/* First blood */}
                            <TableRow className="">
                                <TableCell>First Blood</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.firstBloodKill ? (
                                                    <Sword
                                                        color="#ef4444"
                                                        className="w-5 h-5 m-auto"
                                                    />
                                                ) : (
                                                    <span></span>
                                                )}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* Total damage to champion */}
                            <TableRow className="border-0">
                                <TableCell>Total Damage to Champions</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.totalDamageDealtToChampions.toLocaleString()}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* Physical damage to champions */}
                            <TableRow className="border-0">
                                <TableCell>
                                    Physical Damage to Champions
                                </TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.physicalDamageDealtToChampions.toLocaleString()}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* Magic damage to champions */}
                            <TableRow className="border-0">
                                <TableCell>Magic Damage to Champions</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.magicDamageDealtToChampions.toLocaleString()}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* True damage to champions */}
                            <TableRow className="border-0">
                                <TableCell>True Damage to Champions</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.trueDamageDealtToChampions.toLocaleString()}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* Total damage dealt */}
                            <TableRow className="border-0">
                                <TableCell>Total Damage Dealt</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.totalDamageDealt.toLocaleString()}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* Physical damage dealt */}
                            <TableRow className="border-0">
                                <TableCell>Physical Damage Dealt</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.physicalDamageDealt.toLocaleString()}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* Magic damage dealt */}
                            <TableRow className="border-0">
                                <TableCell>Magic Damage Dealt</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.magicDamageDealt.toLocaleString()}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* True damage dealt */}
                            <TableRow className="border-0">
                                <TableCell>True Damage Dealt</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.trueDamageDealt.toLocaleString()}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* Largest critical strike */}
                            <TableRow className="border-0">
                                <TableCell>Largest Critical Strike</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.largestCriticalStrike.toLocaleString()}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* Total damage to turrets */}
                            <TableRow className="border-0">
                                <TableCell>Total Damage to Turrets</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.damageDealtToTurrets.toLocaleString()}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* Total damage to objectives */}
                            <TableRow className="">
                                <TableCell>
                                    Total Damage to Objectives
                                </TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.damageDealtToObjectives.toLocaleString()}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* Total damage healed */}
                            <TableRow className="border-0">
                                <TableCell>Total Damage Healed</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.totalHeal.toLocaleString()}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* Total damage taken */}
                            <TableRow className="border-0">
                                <TableCell>Total Damage Taken</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.totalDamageTaken.toLocaleString()}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* Physical damage taken */}
                            <TableRow className="border-0">
                                <TableCell>Physical Damage Taken</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.physicalDamageTaken.toLocaleString()}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* Magic damage taken */}
                            <TableRow className="border-0">
                                <TableCell>Magic Damage Taken</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.magicDamageTaken.toLocaleString()}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* True damage taken */}
                            <TableRow className="border-0">
                                <TableCell>True Damage Taken</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.trueDamageTaken.toLocaleString()}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* Self mitigated damage */}
                            <TableRow className="">
                                <TableCell>Self Mitigated Damage</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.damageSelfMitigated.toLocaleString()}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* Vision score */}
                            <TableRow className="border-0">
                                <TableCell>Vision Score</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.visionScore}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* Wards placed */}
                            <TableRow className="border-0">
                                <TableCell>Wards Placed</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.wardsPlaced}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* Wards destroyed */}
                            <TableRow className="border-0">
                                <TableCell>Wards Destroyed</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.wardsKilled}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* Control wards purchased */}
                            <TableRow className="">
                                <TableCell>Control Wards Purchased</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {
                                                    participant.visionWardsBoughtInGame
                                                }
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* Gold earned */}
                            <TableRow className="border-0">
                                <TableCell>Gold Earned</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.goldEarned.toLocaleString()}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* Gold spent */}
                            <TableRow className="border-0">
                                <TableCell>Gold Spent</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.goldSpent.toLocaleString()}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* Minions killed */}
                            <TableRow className="">
                                <TableCell>Minions Killed</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.totalMinionsKilled +
                                                    participant.neutralMinionsKilled}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* Towers */}
                            <TableRow className="border-0">
                                <TableCell>Towers</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.turretKills}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {/* Inhibitors */}
                            <TableRow className="border-0">
                                <TableCell>Inhibitors</TableCell>
                                {matchData.info.participants.map(
                                    (participant) => {
                                        return (
                                            <TableCell
                                                key={participant.puuid}
                                                className="text-center">
                                                {participant.inhibitorKills}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TabsContent>
            </Tabs>
        </div>
    );
}
