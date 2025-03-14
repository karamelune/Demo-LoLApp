import { Match, Participant } from '@/types/match';

interface PlayerGoodPerformanceBadges {
    largestMultiKill: string;
    mostDamage: string;
    mostGold: string;
    mostCs: string;
    mostKills: string;
    mostAssists: string;
    leastDeaths: string;
    neverDied: string;
    mostVision: string;
}

interface PlayerBadPerformanceBadges {
    mostDeaths: string;
    leastDamage: string;
    leastGold: string;
    leastCs: string;
    leastKills: string;
    leastAssists: string;
    leastVision: string;
}

export function checkPlayerGoodPerformanceBadges(
    matchData: Match,
    player: Participant
): PlayerGoodPerformanceBadges {
    let playerGoodPerformanceBadges: PlayerGoodPerformanceBadges = {
        largestMultiKill: '',
        mostDamage: '',
        mostGold: '',
        mostCs: '',
        mostKills: '',
        mostAssists: '',
        leastDeaths: '',
        neverDied: '',
        mostVision: '',
    };

    const largestMultiKillText = () => {
        switch (player?.largestMultiKill) {
            case 2:
                return 'Double Kill';
            case 3:
                return 'Triple Kill';
            case 4:
                return 'Quadruple Kill';
            case 5:
                return 'Pentakill';
            default:
                return '';
        }
    };

    playerGoodPerformanceBadges = {
        ...playerGoodPerformanceBadges,
        largestMultiKill: largestMultiKillText(),
    };

    const playerDamage = player.totalDamageDealtToChampions;
    const mostDamage = matchData.info.participants.every(
        (participant) => participant.totalDamageDealtToChampions <= playerDamage
    );

    if (mostDamage && playerDamage > 0) {
        playerGoodPerformanceBadges = {
            ...playerGoodPerformanceBadges,
            mostDamage: 'Destroyer',
        };
    }
    const playerGold = player.goldEarned;
    const mostGold = matchData.info.participants.every(
        (participant) => participant.goldEarned <= playerGold
    );

    if (mostGold && playerGold > 1000) {
        playerGoodPerformanceBadges = {
            ...playerGoodPerformanceBadges,
            mostGold: 'Midas',
        };
    }

    const playerCs =
        (player?.totalMinionsKilled ?? 0) + (player?.neutralMinionsKilled ?? 0);
    const mostCs = matchData.info.participants.every(
        (participant) =>
            (participant.totalMinionsKilled ?? 0) +
                (participant.neutralMinionsKilled ?? 0) <=
            playerCs
    );

    if (mostCs && matchData.info.gameDuration > 300) {
        playerGoodPerformanceBadges = {
            ...playerGoodPerformanceBadges,
            mostCs: 'Farmer',
        };
    }

    const mostKills = matchData.info.participants.every(
        (participant) => participant.kills <= player.kills
    );

    if (mostKills && player.kills > 0) {
        playerGoodPerformanceBadges = {
            ...playerGoodPerformanceBadges,
            mostKills: 'Killer',
        };
    }

    const mostAssists = matchData.info.participants.every(
        (participant) => participant.assists <= player.assists
    );

    if (mostAssists && player.assists > 0) {
        playerGoodPerformanceBadges = {
            ...playerGoodPerformanceBadges,
            mostAssists: 'Helper',
        };
    }

    const leastDeaths = matchData.info.participants.every(
        (participant) => participant.deaths >= player.deaths
    );
    const neverDied = player.deaths === 0;

    if (leastDeaths && matchData.info.gameDuration > 300) {
        playerGoodPerformanceBadges = {
            ...playerGoodPerformanceBadges,
            leastDeaths: 'Survivor',
        };
    }

    if (neverDied && matchData.info.gameDuration > 300) {
        playerGoodPerformanceBadges = {
            ...playerGoodPerformanceBadges,
            neverDied: 'Immortal',
        };
    }

    if (leastDeaths && neverDied) {
        playerGoodPerformanceBadges = {
            ...playerGoodPerformanceBadges,
            leastDeaths: '',
        };
    }

    const playerVision = player.visionScore;
    if (playerVision !== 0) {
        const mostVision = matchData.info.participants.every(
            (participant) => participant.visionScore <= playerVision
        );

        if (mostVision && playerVision > 1) {
            playerGoodPerformanceBadges = {
                ...playerGoodPerformanceBadges,
                mostVision: 'Omnicient',
            };
        }
    }

    return playerGoodPerformanceBadges;
}

export function checkPlayerBadPerformanceBadges(
    matchData: Match,
    player: Participant
): PlayerBadPerformanceBadges {
    let playerBadPerformanceBadges: PlayerBadPerformanceBadges = {
        mostDeaths: '',
        leastDamage: '',
        leastGold: '',
        leastCs: '',
        leastKills: '',
        leastAssists: '',
        leastVision: '',
    };

    const mostDeaths = matchData.info.participants.every(
        (participant) => participant.deaths <= player.deaths
    );

    if (mostDeaths && player.deaths > 0) {
        playerBadPerformanceBadges = {
            ...playerBadPerformanceBadges,
            mostDeaths: 'Feeder',
        };
    }

    const playerDamage = player.totalDamageDealtToChampions;
    const leastDamage = matchData.info.participants.every(
        (participant) => participant.totalDamageDealtToChampions >= playerDamage
    );

    if (leastDamage && playerDamage > 0) {
        playerBadPerformanceBadges = {
            ...playerBadPerformanceBadges,
            leastDamage: 'Weakling',
        };
    }

    const playerGold = player.goldEarned;
    const leastGold = matchData.info.participants.every(
        (participant) => participant.goldEarned >= playerGold
    );

    if (leastGold && playerGold > 1000) {
        playerBadPerformanceBadges = {
            ...playerBadPerformanceBadges,
            leastGold: 'Broke',
        };
    }

    const playerCs =
        (player?.totalMinionsKilled ?? 0) + (player?.neutralMinionsKilled ?? 0);

    const leastCs = matchData.info.participants.every(
        (participant) =>
            (participant.totalMinionsKilled ?? 0) +
                (participant.neutralMinionsKilled ?? 0) >=
            playerCs
    );

    if (
        leastCs &&
        matchData.info.gameDuration > 300 &&
        matchData.info.gameMode !== 'ARAM'
    ) {
        playerBadPerformanceBadges = {
            ...playerBadPerformanceBadges,
            leastCs: 'Lazy',
        };
    }

    const leastKills = matchData.info.participants.every(
        (participant) => participant.kills >= player.kills
    );

    if (leastKills && player.kills > 0) {
        playerBadPerformanceBadges = {
            ...playerBadPerformanceBadges,
            leastKills: 'Coward',
        };
    }

    const leastAssists = matchData.info.participants.every(
        (participant) => participant.assists >= player.assists
    );

    if (leastAssists && player.assists > 0) {
        playerBadPerformanceBadges = {
            ...playerBadPerformanceBadges,
            leastAssists: 'Selfish',
        };
    }

    const playerVision = player.visionScore;
    if (playerVision !== 0) {
        const leastVision = matchData.info.participants.every(
            (participant) => participant.visionScore >= playerVision
        );

        if (leastVision && playerVision > 1) {
            playerBadPerformanceBadges = {
                ...playerBadPerformanceBadges,
                leastVision: 'Blind',
            };
        }
    }

    return playerBadPerformanceBadges;
}
