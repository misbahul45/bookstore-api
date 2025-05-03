import db from "../db/index.js";
import { notifications } from "../db/schema.js";
import { and, eq, lt} from 'drizzle-orm';
import { AppError } from "../middleware/errorHandler.js";

class NotificationsService{
     async create(userId, data){
        try {
             await db.insert(notifications).values({
                userId,
                ...data,
             });
             return true;
        }catch{
            throw new AppError("Failed to create notification", 400);
        }
     }

     async update(userId){
        try {
            await db.update(notifications).set({isRead: true}).where({userId});
            return true;
        } catch{
            throw new AppError("Failed to update notification", 400);
        }
     }

     async all(userId, take=10, page=1){
        try {
            // Hapus notifikasi yang sudah dibaca dan melewati masa retensi
            await db.delete(notifications)
            .where(
               and(
                  eq(notifications.userId, userId),
                  eq(notifications.isRead, true),
                  lt(notifications.readAt, new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000))) // 7 hari
               )
            );
            const skip = (page - 1) * take;
            const notifications = await db.select().from(notifications).where({userId}).limit(take).offset(skip);
            return notifications;
        } catch{
            throw new AppError("Failed to get notifications", 500);
        }
     }
}

export default new NotificationsService();