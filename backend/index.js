import express from 'express';
import cors from 'cors';
import UserRoutes from './routes/UserRoutes.js';

const app = express();

// config JSON response
app.use(express.json());

// solve cors
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

// public folder for images
app.use(express.static('public'));

// routes
app.use('/users', UserRoutes);

app.listen(5000, () => console.log('API started!'));
