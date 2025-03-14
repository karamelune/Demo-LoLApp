import { League } from './league';
import { Mastery } from './mastery';

export type User = {
    accountId: string;
    gameName: string;
    id: string;
    profileIconId: number;
    puuid: string;
    revisionDate: number;
    summonerLevel: number;
    tagLine: string;
    leagues: League[];
    matches: string[];
    masteries: Mastery[];
};
