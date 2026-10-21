import express from 'express';
import { fileURLToPath } from 'node:url';

export const app = express();
app.disable('x-powered-by');
app.use((request, response, next) => {
  response.set({
    'Content-Security-Policy': "default-src 'self'; script-src 'none'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  });
  next();
});
app.get('/up', (request, response) => response.type('text').send('OK'));
app.use(express.static(fileURLToPath(new URL('./public/', import.meta.url)), {
  dotfiles: 'deny',
  maxAge: 0,
}));
app.use((request, response) => response.status(404).type('text').send('Page not found'));
