import { Actor, log } from 'apify';

import { runCopartScraper } from './copart.js';

interface Input {
    startUrl: string;
    maxItems?: number;
}

await Actor.init();

const input = (await Actor.getInput<Input>()) ?? ({} as Input);

if (!input.startUrl || typeof input.startUrl !== 'string') {
    throw new Error('O campo "startUrl" é obrigatório e deve ser uma string.');
}

const trimmedUrl = input.startUrl.trim();
if (trimmedUrl.length === 0) {
    throw new Error('O campo "startUrl" não pode ser vazio.');
}

const collected = await runCopartScraper({
    startUrl: trimmedUrl,
    maxItems: input.maxItems,
});

log.info(`[Copart] Coleta concluída com ${collected} item(ns).`);

await Actor.exit();
