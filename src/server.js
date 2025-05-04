import express from 'express';
import 'dotenv/config';
import AuthRouter from './routers/AuthRouter.js';
import BookRouter from './routers/BookRouter.js';
import { AppError, errorHandler } from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import UploadRouter from './routers/UploadRouter.js';
import { setupCors } from './lib/utils.js';
import notification from './sockets/NotificationSocket.js';
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './lib/swagger.js';


const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

app.use(setupCors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//socket service
notification.initialize(server);

//res api
app.get('/api', (req, res, next) => {
   res.json({
    message: "API is working",
   });
});
app.use('/api/auth', AuthRouter);
app.use('/api/books', BookRouter);
app.use('/api/uploads', UploadRouter);

app.use((req, _, next) => {
  try {
    throw new AppError(`not found router-${req.originalUrl}`, 404);
  } catch (error) {
    next(error);
  }
})
app.use(errorHandler)


server.listen(PORT,() => {
  console.log(`Server is running on port ${PORT}`);
});
