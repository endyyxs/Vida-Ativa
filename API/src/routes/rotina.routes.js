const { Router } = require('express');
const RotinaController = require('../controllers/rotinacontroller');

const router = Router();

// GET /rotinas -> Listar todas as rotinas para a tabela do Administrador
router.get('/', RotinaController.listarTodas);

// GET /rotinas/recomendadas -> Buscar os treinos recomendados filtrados para a saúde do idoso
router.get('/recomendadas', RotinaController.buscarRecomendadas);

// POST /rotinas -> Criar uma nova rotina amarrando o array de exercícios (UUIDs)
router.post('/', RotinaController.cadastrar);

// Adicione esta linha (de preferência antes das rotas com subcaminhos se houver conflito, ou logo abaixo da listagem geral)
router.get('/:id', RotinaController.buscarPorId);

// PUT /rotinas/:id -> Editar os atributos da rotina
router.put('/:id', RotinaController.editar);

// DELETE /rotinas/:id -> Remover a rotina completa
router.delete('/:id', RotinaController.excluir);

module.exports = router;