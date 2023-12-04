import { z } from "zod";

export const USER_SCHEMA = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
});

