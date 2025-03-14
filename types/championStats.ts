export type ChampionStats = {
    championKey: number;
    championId: string;
    championName: string;
    stats: {
        total: {
            matchesNumber: number;
            averageKills: number;
            averageDeaths: number;
            averageAssists: number;
            winRate: number;
        };
        normal: {
            matchesNumber: number | null;
            averageKills: number | null;
            averageDeaths: number | null;
            averageAssists: number | null;
            winRate: number | null;
        };
        ranked: {
            matchesNumber: number | null;
            averageKills: number | null;
            averageDeaths: number | null;
            averageAssists: number | null;
            winRate: number | null;
            mostPlayedRole: string | null;
            mostPlayedRoleBanRate: number | null;
            mostPlayedRolePickRate: number | null;
            secondaryRole: string | null;
            roles: {
                [key: string]: {
                    matchesNumber: number | null;
                    averageKills: number | null;
                    averageDeaths: number | null;
                    averageAssists: number | null;
                    winRate: number | null;
                };
            };
            againstChampions: AgainstChampionsStats;
        };
    };
};

export type AgainstChampionsStats = {
    [championKey: number]: {
        championId: string;
        championName: string;
        matchesNumber: number;
        winRate: number;
    };
};
