import { Router } from 'express';

import { consultarStatusPublicoController } from './consulta-status.controller';

const consultaStatusRoutes = Router();

consultaStatusRoutes.get('/', consultarStatusPublicoController);

export default consultaStatusRoutes;

