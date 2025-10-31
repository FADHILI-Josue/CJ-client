import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { setupSwagger } from './utils/swagger';
import { logger } from './utils/logger';
// Import your routes here
// import authRoutes from './routes/authRoutes';

const app = express();
const PORT = process.env.PORT || 5001;

// --- Middlewares ---
app.use(helmet()); // Secure HTTP headers
app.use(cors({ origin: 'http://localhost:3000' })); // Adjust for your frontend URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_, res) => {
        logger.warn('Rate limit exceeded');
        res.status(429).send('Too many requests, please try again later.');
    }
});
app.use(limiter);

// --- Swagger Docs ---
setupSwagger(app);

// --- Routes ---
import authRoutes from './routes/authRoutes';
import accountRoutes from './routes/accountRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);
// ... other routes

app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});