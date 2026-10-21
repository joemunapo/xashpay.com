import { app } from './app.js';

const server = app.listen(process.env.PORT || 3000);
process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 25_000).unref();
});
