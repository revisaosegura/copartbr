import { Actor, log } from 'apify';

import { runCopartScraper } from './copart.js';

interface Input {
    startUrl?: unknown;
    maxItems?: number;
}

const DEFAULT_START_URL =
    'https://www.copart.com.br/search/leilão/?displayStr=Leilão&from=%2FvehicleFinder';

function sanitizeStartUrl(value: unknown): string | null {
    if (typeof value !== 'string') {
        return null;
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }

    try {
        new URL(trimmed);
    } catch {
        return null;
    }

    return trimmed;
}

await Actor.init();

const input = (await Actor.getInput<Input>()) ?? {};

const startUrlCandidates: Array<{ value: unknown; source: string }> = [
    { value: input.startUrl, source: 'input' },
    { value: process.env.COPART_APIFY_START_URL, source: 'environment: COPART_APIFY_START_URL' },
    { value: process.env.START_URL, source: 'environment: START_URL' },
    { value: DEFAULT_START_URL, source: 'default' },
];

let resolvedStartUrl: string | null = null;
let resolvedSource: string | null = null;

for (const candidate of startUrlCandidates) {
    const sanitized = sanitizeStartUrl(candidate.value);
    if (sanitized) {
        resolvedStartUrl = sanitized;
        resolvedSource = candidate.source;
        break;
    }
}

if (!resolvedStartUrl) {
    resolvedStartUrl = DEFAULT_START_URL;
    resolvedSource = 'default (fallback)';
}

if (resolvedSource && resolvedSource !== 'input') {
    log.warning(`[Copart] Utilizando URL inicial proveniente de ${resolvedSource}.`);
}

const collected = await runCopartScraper({
    startUrl: resolvedStartUrl,
    maxItems: input.maxItems,
});

log.info(`[Copart] Coleta concluída com ${collected} item(ns).`);

await Actor.exit();
