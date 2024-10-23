import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import routes from './app/routes';
import swaggerUi from 'swagger-ui-express'; 
import swaggerOptions from './app/swagger/swaggerOptions';
import cookieParser from 'cookie-parser';

const app: Application = express();

app.use(
  cors({
    origin: [ 'http://localhost:3000'],
    credentials: true,
  }),
);

app.use(cookieParser());

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

app.use('/api/v1', routes);



app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

export default app;
