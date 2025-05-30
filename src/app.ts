// src/app.ts

import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from './config';
import caseRoutes from './routes/cases';
import assignRoutes from './routes/assignments';
import { poolConnect } from './db/connection';
import auth from './routes/auth';
import user from './routes/user';
import reportsRoutes from './routes/reports';
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan(config.logLevel));

app.get('/health', (_req: Request, res: Response) => {
    res.json({ success: true, timestamp: new Date().toISOString() });
});

app.use(async (_req: Request, _res: Response, next: NextFunction) => {
    await poolConnect;
    next();
});

// Public routes

app.use('/api/auth', auth);
app.use('/api/users', user);
app.use('/api/cases', caseRoutes);
app.use('/api/assignments', assignRoutes);
app.use('/api/reports', reportsRoutes);
// 404 handler
app.use((_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

export default app;
