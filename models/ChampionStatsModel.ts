import { Schema, model, models } from 'mongoose';
import { ChampionStats } from '@/types/championStats';

const AgainstChampionsStatsSchema = new Schema(
    {
        championId: { type: String, required: true },
        championName: { type: String, required: true },
        matchesNumber: { type: Number, required: true },
        winRate: { type: Number, required: true },
    },
    { _id: false }
);

const StatsSchema = new Schema({
    total: {
        matchesNumber: { type: Number, required: true },
        averageKills: { type: Number, required: true },
        averageDeaths: { type: Number, required: true },
        averageAssists: { type: Number, required: true },
        winRate: { type: Number, required: true },
    },
    normal: {
        matchesNumber: { type: Number, default: null },
        averageKills: { type: Number, default: null },
        averageDeaths: { type: Number, default: null },
        averageAssists: { type: Number, default: null },
        winRate: { type: Number, default: null },
    },
    ranked: {
        matchesNumber: { type: Number, default: null },
        averageKills: { type: Number, default: null },
        averageDeaths: { type: Number, default: null },
        averageAssists: { type: Number, default: null },
        winRate: { type: Number, default: null },
        mostPlayedRole: { type: String, default: null },
        mostPlayedRoleBanRate: { type: Number },
        mostPlayedRolePickRate: { type: Number },
        secondaryRole: { type: String, default: null },
        roles: {
            top: {
                matchesNumber: { type: Number, default: null },
                averageKills: { type: Number, default: null },
                averageDeaths: { type: Number, default: null },
                averageAssists: { type: Number, default: null },
                winRate: { type: Number, default: null },
            },
            jungle: {
                matchesNumber: { type: Number, default: null },
                averageKills: { type: Number, default: null },
                averageDeaths: { type: Number, default: null },
                averageAssists: { type: Number, default: null },
                winRate: { type: Number, default: null },
            },
            mid: {
                matchesNumber: { type: Number, default: null },
                averageKills: { type: Number, default: null },
                averageDeaths: { type: Number, default: null },
                averageAssists: { type: Number, default: null },
                winRate: { type: Number, default: null },
            },
            adc: {
                matchesNumber: { type: Number, default: null },
                averageKills: { type: Number, default: null },
                averageDeaths: { type: Number, default: null },
                averageAssists: { type: Number, default: null },
                winRate: { type: Number, default: null },
            },
            support: {
                matchesNumber: { type: Number, default: null },
                averageKills: { type: Number, default: null },
                averageDeaths: { type: Number, default: null },
                averageAssists: { type: Number, default: null },
                winRate: { type: Number, default: null },
            },
        },
        againstChampions: {
            type: Map,
            of: AgainstChampionsStatsSchema,
            required: true,
        },
    },
});

const ChampionStatsSchema = new Schema<ChampionStats>({
    championKey: { type: Number, required: true },
    championId: { type: String, required: true },
    championName: { type: String, required: true },
    stats: { type: StatsSchema }, // Utilisation du schéma défini pour "stats"
});

export const ChampionStatsModel =
    models.ChampionStats ||
    model<ChampionStats>('ChampionStats', ChampionStatsSchema);
