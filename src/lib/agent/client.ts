import Anthropic from "@anthropic-ai/sdk";

// Instanciation paresseuse : la clé (ANTHROPIC_API_KEY) est lue dans l'environnement au premier appel.
let client: Anthropic | null = null;
export const anthropic = () => (client ??= new Anthropic({ timeout: 60_000 }));
