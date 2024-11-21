import express from 'express';
import { config } from './config';
import leilaoRoutes from './routes/leilao.routes';

const app = express();

app.use(express.json());
app.use('/api/leilao', leilaoRoutes);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});