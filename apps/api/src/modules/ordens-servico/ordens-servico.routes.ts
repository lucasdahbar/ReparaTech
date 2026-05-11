import { Router } from 'express';

import {
  atualizarOrdemServicoController,
  atualizarStatusOrdemServicoController,
  cadastrarOrdemServicoController,
  listarOrdensServicoController,
  obterOrdemServicoController,
  removerOrdemServicoController,
  vincularPecaNaOrdemServicoController
} from './ordens-servico.controller';

const ordensServicoRoutes = Router();

ordensServicoRoutes.get('/', listarOrdensServicoController);
ordensServicoRoutes.get('/:id', obterOrdemServicoController);
ordensServicoRoutes.post('/', cadastrarOrdemServicoController);
ordensServicoRoutes.put('/:id', atualizarOrdemServicoController);
ordensServicoRoutes.patch('/:id/status', atualizarStatusOrdemServicoController);
ordensServicoRoutes.post('/:id/pecas', vincularPecaNaOrdemServicoController);
ordensServicoRoutes.delete('/:id', removerOrdemServicoController);

export default ordensServicoRoutes;
