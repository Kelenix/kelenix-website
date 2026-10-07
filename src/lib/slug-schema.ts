import { z } from "zod";
import { slugify } from "@/lib/utils";

// Normalise tout slug saisi dans l'admin (« Custom SaaS » → « custom-saas ») pour qu'il reste valide dans une URL.
export const slugSchema = z
  .string()
  .min(1)
  .max(100)
  .transform(slugify)
  .pipe(z.string().min(1));
