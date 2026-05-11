import { Router } from 'express';

import {
  cadastrarPecaController,
  listarPecasController,
  obterPecaController,
  removerPecaController,
  atualizarPecaController
} from './pecas.controller';

const pecasRoutes = Router();

pecasRoutes.get('/', listarPecasController);
pecasRoutes.get('/:id', obterPecaController);
pecasRoutes.post('/', cadastrarPecaController);
pecasRoutes.put('/:id', atualizarPecaController);
pecasRoutes.delete('/:id', removerPecaController);

export default pecasRoutes;
