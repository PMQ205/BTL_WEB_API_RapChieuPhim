import dotenv from 'dotenv';
import express, { Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import './Sources/config/Database/db.js';
import { logger } from './Sources/config/logger.js';
import Film_Router from './Sources/Routes/Film_Router.js';


dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(compression());
app.use(express.json({ limit: '5mb' }));

app.get('/', (req, res) => {
  res.json({ message: 'API RAPCHIEUPHIM đang chạy!' });
});

app.use('/films', Film_Router); 


app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res) => {
  logger.error(err);

  const status = err.status || 500;

  res.status(status).json({
    status,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server đang chạy tại http://localhost:${PORT}`);
});
