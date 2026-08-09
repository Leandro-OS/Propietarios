import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import comunidadesRoutes from './routes/comunidades.routes.js';
import propietariosRoutes from './routes/propietarios.routes.js';
import historicosRoutes from './routes/historicos.routes.js';
import busquedaRoutes from './routes/busqueda.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/comunidades', comunidadesRoutes);
app.use('/api/propietarios', propietariosRoutes);
app.use('/api/historicos', historicosRoutes);
app.use('/api/busqueda', busquedaRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Servidor backend ejecutándose en http://localhost:${PORT}`);
});
