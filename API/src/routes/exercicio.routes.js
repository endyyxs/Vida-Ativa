const { Router } = require('express');
const ExercicioController = require('../controllers/exerciciocontroller');

const router = Router();

// GET /exercicios -> Listar todos os exercícios cadastrados no Neon
router.get('/', ExercicioController.listarTodos);

// POST /exercicios -> Cadastrar novos exercícios
router.post('/', ExercicioController.cadastrar);

// PUT /exercicios/:id -> Editar TODOS os atributos do exercício
router.put('/:id', ExercicioController.atualizar);

// DELETE /exercicios/:id -> Excluir o exercício do banco
router.delete('/:id', ExercicioController.excluir);

module.exports = router;