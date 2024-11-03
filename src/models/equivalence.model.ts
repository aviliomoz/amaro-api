import { z } from "zod";

export const EquivalenceSchema = z.object({
    id: z.string().uuid().optional(),
    item_id: z.string().uuid(),
    um: z.string().max(5),
    amount: z.number().min(0),
});

export type Equivalence = z.infer<typeof EquivalenceSchema>

export const Equivalence = {

}