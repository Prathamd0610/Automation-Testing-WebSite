import { z } from 'zod';

/** Transfer money between the signed-in user's own checking/savings. */
export const transferSchema = z
  .object({
    from: z.enum(['checking', 'savings']),
    to: z.enum(['checking', 'savings']),
    amount: z.coerce.number().positive().max(1_000_000_000),
    description: z.string().max(200).optional(),
  })
  .refine((data) => data.from !== data.to, {
    message: 'Source and destination accounts must differ',
    path: ['to'],
  });
