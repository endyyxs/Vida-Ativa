require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mainRouter = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações de Middlewares
app.use(cors()); // Permite que o Front-end (React) faça requisições para cá
app.use(express.json()); // Permite receber payloads em formato JSON no req.body

// Vincula todas as rotas debaixo do prefixo esperado pelo Axios: http://localhost:3000/api
app.use('/api', mainRouter);

// Rota de checagem simples de saúde da API
app.get('/health', (req, res) => {
  res.status(200).json({ status: "API Vida Ativa operando perfeitamente 🚀" });
});

app.use((req, res, next) => {
    console.log(`📡 Requisição Recebida: ${req.method} em ${req.url}`);
    next();
  });

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`  Servidor do Vida Ativa rodando na porta ${PORT}  `);
  console.log(`  Endereço base local: http://localhost:3000/api `);
  console.log(`==================================================`);
});