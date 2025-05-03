import { Server } from 'socket.io';
import NotificationService from '../services/NotificationService.js';

class NotificationSocket{
    io;

    constructor() {
        this.io = null;
    }

    initialize(server) {
        this.io = new Server(server, {
            cors: {
                origin: process.env.CLIENT_URL || "http://localhost:3000",
            }
        });

        this.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);

            // Handle user joining a room
            socket.on('notifications_room', async(roomId) => {
                try {
                    socket.join(roomId);
    
                    const notifications=await NotificationService.all(socket.id);
                    this.emitToRoom(socket.id, 'notifications', notifications);
                } catch (error) {
                    this.emitToRoom(socket.id, 'error', {
                        message: error.message,
                        status: error.status,
                        success: false,
                    }); 
                }
            });

            socket.on("create_notification", async(data)=>{
                try {
                    const notification=await NotificationService.create(data);
                    this.emitToRoom(data.userId, 'notifications', notification);
                } catch (error) {
                    this.emitToRoom(socket.id, 'error', {
                        message: error.message,
                        status: error.status,
                        success: false,
                    });
                }
            })

            socket.on("update_notification", async()=>{
                try {
                    const notification=await NotificationService.update(socket.id);
                    this.emitToRoom(socket.id, 'notifications', notification);
                } catch (error) {
                    this.emitToRoom(socket.id, 'error', {
                        message: error.message,
                        status: error.status,
                        success: false,
                    });
                }
            })

            // Handle user leaving a room
            socket.on('notifications_leave', (roomId) => {
                socket.leave(roomId);
            });


            // Handle disconnection
            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });
    }

    // Method to emit event to specific room
    emitToRoom(room, event, data) {
        if (this.io) {
            this.io.to(room).emit(event, data);
        }
    }

    // Method to emit event to all connected clients
    emitToAll(event, data) {
        if (this.io) {
            this.io.emit(event, data);
        }
    }
}

export default new NotificationSocket();
