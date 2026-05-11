import { Router } from 'express';

import clientesRoutes from '../modules/clientes/clientes.routes';

const routes = Router();

routes.get('/', (_req, res) => {
  res.json({
    mensagem: 'API do ReparaTech em funcionamento.'
  });
});

routes.use('/clientes', clientesRoutes);

export default routes;
