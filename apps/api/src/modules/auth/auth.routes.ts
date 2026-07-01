import { Router } from 'express';

import { loginController } from './auth.controller';

const authRoutes = Router();

authRoutes.post('/login', loginController);

export default authRoutes;
