const { Router } = require('express');
const UsuarioController = require('../controllers/usuariocontroller');

const router = Router();

// POST /usuarios/login -> Login de qualquer persona
router.post('/login', UsuarioController.login);

// POST /usuarios/cadastro -> Registro condicional (Idoso ou Profissional)
router.post('/cadastro', UsuarioController.cadastrar);

// PUT /usuarios/:id -> Atualização dos dados na tela "Meu Perfil"
router.put('/:id', UsuarioController.atualizarPerfil);

// POST /usuarios/:id/avaliacao -> Submeter o quiz inicial e classificar o idoso
router.post('/:id/avaliacao', UsuarioController.submeterAvaliacao);
// Buscar o histórico do idoso
router.get('/:id/historico', UsuarioController.buscarHistorico);
// Salvar um novo treino realizado (chamado no final do treino)
router.post('/:id/historico', UsuarioController.salvarTreinoRealizado);

module.exports = router;