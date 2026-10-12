import Anthropic from "@anthropic-ai/sdk";

// Instanciation paresseuse : la clé (ANTHROPIC_API_KEY) est lue dans l'environnement au premier appel.
let client: Anthropic | null = null;
export const anthropic = () => (client ??= new Anthropic({ timeout: 60_000 }));

/** Les outils web « avec filtrage » (versions 20260209) n'existent que sur les modèles Opus, Sonnet et Fable. */
export const filteredWebTools = (model: string) => /^claude-(opus|sonnet|fable)/.test(model);
