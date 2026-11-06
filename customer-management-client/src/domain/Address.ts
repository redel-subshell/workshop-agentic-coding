import { z } from 'zod';

export const addressSchema = z.object({
  street: z
    .string()
    .min(1, 'Straße ist erforderlich')
    .max(255, 'Straße darf maximal 255 Zeichen lang sein'),
  houseNumber: z
    .string()
    .min(1, 'Hausnummer ist erforderlich')
    .max(20, 'Hausnummer darf maximal 20 Zeichen lang sein'),
  postalCode: z
    .string()
    .min(1, 'Postleitzahl ist erforderlich')
    .max(20, 'Postleitzahl darf maximal 20 Zeichen lang sein'),
  city: z
    .string()
    .min(1, 'Ort ist erforderlich')
    .max(255, 'Ort darf maximal 255 Zeichen lang sein'),
});

export type Address = z.infer<typeof addressSchema>;
