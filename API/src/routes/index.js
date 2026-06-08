const { Router } = require('express');
const usuarioRoutes = require('./usuario.routes');
const exercicioRoutes = require('./exercicio.routes');
const rotinaRoutes = require('./rotina.routes');

const mainRouter = Router();

// Distribuição dos caminhos da API
mainRouter.use('/usuarios', usuarioRoutes);
mainRouter.use('/exercicios', exercicioRoutes);
mainRouter.use('/rotinas', rotinaRoutes);

module.exports = mainRouter;