import { Router } from 'express';

import authRoutes from '../modules/auth/auth.routes';
import { exigirAutenticacao } from '../modules/auth/auth.middleware';
import clientesRoutes from '../modules/clientes/clientes.routes';
import aparelhosRoutes from '../modules/aparelhos/aparelhos.routes';
import consultaStatusRoutes from '../modules/consulta-status/consulta-status.routes';
import pecasRoutes from '../modules/pecas/pecas.routes';
import ordensServicoRoutes from '../modules/ordens-servico/ordens-servico.routes';

const routes = Router();

routes.get('/', (_req, res) => {
  res.json({
    mensagem: 'API do ReparaTech em funcionamento.'
  });
});

routes.use('/auth', authRoutes);
routes.use('/clientes', exigirAutenticacao(['ADMIN', 'ATENDENTE']), clientesRoutes);
routes.use('/aparelhos', exigirAutenticacao(['ADMIN', 'ATENDENTE']), aparelhosRoutes);
routes.use('/consulta-status', consultaStatusRoutes);
routes.use('/pecas', exigirAutenticacao(['ADMIN', 'TECNICO']), pecasRoutes);
routes.use('/ordens-servico', exigirAutenticacao(['ADMIN', 'ATENDENTE', 'TECNICO']), ordensServicoRoutes);

export default routes;
