import { League } from '@/types/league';
import { Mastery } from '@/types/mastery';
import { User } from '@/types/user';
import { Schema, model, models } from 'mongoose';

const LeagueSchema = new Schema<League>({
    leagueId: String,
    queueType: String,
    tier: String,
    rank: String,
    leaguePoints: Number,
    wins: Number,
    losses: Number,
    veteran: Boolean,
    inactive: Boolean,
    freshBlood: Boolean,
    hotStreak: Boolean,
});

const MasterySchema = new Schema<Mastery>({
    key: Number,
    id: String,
    name: String,
    championLevel: Number,
    championPoints: Number,
});

const UserSchema = new Schema<User>({
    accountId: { type: String, required: true },
    gameName: { type: String, required: true },
    id: { type: String, required: true },
    profileIconId: { type: Number, required: true },
    puuid: { type: String, required: true, unique: true },
    revisionDate: { type: Number, required: true },
    summonerLevel: { type: Number, required: true },
    tagLine: { type: String, required: true },
    leagues: { type: [LeagueSchema], default: [] },
    matches: { type: [String], default: [] },
    masteries: { type: [MasterySchema], default: [] },
});

UserSchema.index({ gameName: 1, tagLine: 1 });
UserSchema.index({ puuid: 1 });

export const UserModel = models.User || model<User>('User', UserSchema);
