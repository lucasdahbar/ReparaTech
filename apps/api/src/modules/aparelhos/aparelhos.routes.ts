import { Router } from 'express';

import {
  atualizarAparelhoController,
  cadastrarAparelhoController,
  listarAparelhosController,
  obterAparelhoController,
  removerAparelhoController
} from './aparelhos.controller';

const aparelhosRoutes = Router();

aparelhosRoutes.get('/', listarAparelhosController);
aparelhosRoutes.get('/:id', obterAparelhoController);
aparelhosRoutes.post('/', cadastrarAparelhoController);
aparelhosRoutes.put('/:id', atualizarAparelhoController);
aparelhosRoutes.delete('/:id', removerAparelhoController);

export default aparelhosRoutes;
