import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import { createServer } from 'http';
import 'dotenv/config';

import { logWithSeparator } from './utils/log';
import { authRoutes, siteRoutes, userRoutes } from './routes';
import { Environment } from './interfaces/general';
import HttpError from './utils/error';

// Create app and HTTP core
const app = express();
const httpServer = createServer(app);

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// CORS configuration middleware
app.use((req: Request, res: Response, next: NextFunction): void => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
    'http://localhost:5174',
    'http://localhost:4174',
    'https://site-tracker.viktor-indie.com',
  ];

  res.setHeader('Vary', 'Origin');
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, PUT, HEAD, OPTIONS'
  );

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }

  next();
});

// Static files
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/site', siteRoutes);
app.use('/api/v1/user', userRoutes);

// Wild route
app.use('/', async (req: Request, res: Response) => {
  console.log('WILD ROUTE APPEARED !!!', req.path);
  res.send(`You are trying to access the backend with this path: ${req.path}`);
});

// 404 middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  throw new HttpError('Could not find this route', 404);
});

// Error handler
app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  if ((req as any).file) {
    console.warn('Error with file upload');
  }

  if (res.headersSent) {
    return next(error);
  }

  res.status(error.code || 500).json({
    message: error.message || 'An unknown error occurred',
  });
});

const port = process.env.PORT || 5001;
const mode = process.env.NODE_ENV;

if (mode === Environment.DEV) {
  httpServer.listen(5001, () => {
    logWithSeparator(
      `💈💈 Development server started on port 5001 💈💈`,
      'yellow'
    );
  });
}

if (mode === Environment.STAGING) {
  httpServer.listen(port, () => {
    logWithSeparator(`💈💈 Staging server started on ${port} 💈💈`, 'yellow');
  });
}

if (mode === Environment.PROD) {
  httpServer.listen(port, () => {
    logWithSeparator(
      `💈💈 Production server started on ${port} 💈💈`,
      'yellow'
    );
  });
}
