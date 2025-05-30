import express from 'express';
import 'dotenv/config';
import AuthRouter from './routers/AuthRouter.js';
import { AppError, errorHandler } from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';
import UploadRouter from './routers/UploadRouter.js';
import { print, setupCors } from './lib/utils.js';
import notification from './sockets/NotificationSocket.js';
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './lib/swagger.js';
import fileUpload from 'express-fileupload';
import UsersRouter from './routers/UsersRouter.js';
import CategoryRouter from './routers/CategoryRouter.js';


const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

app.use(setupCors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload())
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//socket service
notification.initialize(server);

//res api
app.get('/api', (req, res, next) => {
   res.json({
    message: "API is working",
   });
});
app.use('/api/auth', AuthRouter);
app.use('/api/users', UsersRouter);
app.use('/api/categories', CategoryRouter)
app.use('/api/uploads', UploadRouter);


app.use((req, res, next) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const [s, ns] = process.hrtime(start);
    const ms = (s * 1000 + ns / 1e6).toFixed(2);
    console.log(`${req.method} ${req.url} - ${ms}ms`);
  });
  next();
});


app.use((req, _, next) => {
  try {
    throw new AppError(`not found router-${req.originalUrl}`, 404);
  } catch (error) {
    next(error);
  }
})
app.use(errorHandler)



app._router.stack.forEach(print.bind(null, []))


server.listen(PORT,'0.0.0.0',() => {
  console.log(`Server is running on port ${PORT}`);
});


export default app;