import { Router } from 'express';

import clientesRoutes from '../modules/clientes/clientes.routes';
import pecasRoutes from '../modules/pecas/pecas.routes';
import ordensServicoRoutes from '../modules/ordens-servico/ordens-servico.routes';

const routes = Router();

routes.get('/', (_req, res) => {
  res.json({
    mensagem: 'API do ReparaTech em funcionamento.'
  });
});

routes.use('/clientes', clientesRoutes);
routes.use('/pecas', pecasRoutes);
routes.use('/ordens-servico', ordensServicoRoutes);

export default routes;
