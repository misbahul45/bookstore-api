import { z } from "zod";

export class NotificationSchema {
    static create=z.object({
        userId: z.string(),
        message: z.string(),
        titlre: z.string(),
        type:z.enum(['info', 'success', 'warning', 'error']),
        isRead: z.boolean().default(false),
        entityId: z.string(),
        entityType: z.string(),
    })

    static update=z.object({
        userId: z.string(),
        isRead: z.boolean().default(false),
    })
}
