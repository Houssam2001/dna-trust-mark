import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import establishmentRoutes from './routes/establishment.routes';
import controlRoutes from './routes/control.routes';
import certificationRoutes from './routes/certification.routes';
import adminRoutes from './routes/admin.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/establishments', establishmentRoutes);
app.use('/api/controls', controlRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/admin', adminRoutes);

import path from 'path';

// ... imports

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/establishments', establishmentRoutes);
app.use('/api/controls', controlRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files from the React app
const frontendDist = path.join(__dirname, '../../dist');
app.use(express.static(frontendDist));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
