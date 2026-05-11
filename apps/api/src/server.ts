import 'dotenv/config';

import { app } from './app';
import { env } from './lib/env';

app.listen(env.PORT, () => {
  console.log(`ReparaTech API executando em http://localhost:${env.PORT}`);
});
