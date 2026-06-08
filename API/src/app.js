const express = require('express');
const cors = require('cors');
const mainRouter = require('./routes/index');

const app = express();

// Middlewares essenciais
app.use(cors()); // Permite que o seu frontend React converse com a API sem bloqueios de segurança
app.use(express.json()); // Habilita o Express a entender corpos de requisição em formato JSON

// Injeta o roteador centralizado sob o prefixo /api
app.use('/api', mainRouter);

// Middleware global para tratamento de páginas não encontradas (404)
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada na API do Vida Ativa." });
});

module.exports = app;