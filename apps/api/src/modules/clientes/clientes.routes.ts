import { Router } from 'express';

import {
  alterarClienteController,
  cadastrarClienteController,
  listarClientesController,
  obterClienteController,
  removerClienteController
} from './clientes.controller';

const clientesRoutes = Router();

clientesRoutes.get('/', listarClientesController);
clientesRoutes.get('/:id', obterClienteController);
clientesRoutes.post('/', cadastrarClienteController);
clientesRoutes.put('/:id', alterarClienteController);
clientesRoutes.delete('/:id', removerClienteController);

export default clientesRoutes;
