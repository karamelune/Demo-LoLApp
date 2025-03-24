import NodeCache from 'node-cache';

const nodeCache = new NodeCache();

export const cache = {
    get: async (key: string) => nodeCache.get(key),
    set: async (key: string, value: any, ttl: number) =>
        nodeCache.set(key, value, ttl),
};
