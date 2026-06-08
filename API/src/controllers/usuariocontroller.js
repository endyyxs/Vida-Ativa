const Usuario = require('../models/usuario');
const db = require('../config/database');

const UsuarioController = {
  // Realiza o login das personas
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const usuario = await Usuario.autenticar(email, senha);
      
      return res.status(200).json({
        mensagem: "Login realizado com sucesso!",
        usuario
      });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  },

  // POST /usuarios/cadastro -> Registro condicional mapeado com o front
  async cadastrar(req, res) {
    try {
      const { tipo, nome, email, senha, registro_profissional, restricoes_clinicas } = req.body;

      // Validação básica se o e-mail já existe
      const existe = await db.query('SELECT id FROM usuarios WHERE email = $1', [email.toLowerCase()]);
      if (existe.rows.length > 0) {
        return res.status(400).json({ error: "Este e-mail já está em uso no sistema." });
      }

      // Mapeia os campos dependendo de quem está se cadastrando
      const limitacoes = tipo === 'IDOSO' ? restricoes_clinicas : null;
      const registro = tipo === 'PROFISSIONAL' ? registro_profissional : null;

      const query = `
        INSERT INTO usuarios (tipo, nome, email, senha, limitacoes_fisicas, registro_profissional, respondeu_quiz)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, tipo, nome, email
      `;
      const valores = [tipo, nome, email.toLowerCase(), senha, limitacoes, registro, false];
      const resultado = await db.query(query, valores);

      return res.status(201).json({
        mensagem: "Usuário registrado com sucesso!",
        usuario: resultado.rows[0]
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // PUT /usuarios/:id -> Usado na tela "Meu Perfil"
  async atualizarPerfil(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, senha } = req.body;

      let resultado;
      if (senha && senha.trim() !== '') {
        // Se preencheu uma nova senha, atualiza tudo incluindo a senha
        const query = 'UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4 RETURNING id, nome, email';
        resultado = await db.query(query, [nome, email.toLowerCase(), senha, id]);
      } else {
        // Se a senha veio vazia, atualiza apenas dados cadastrais
        const query = 'UPDATE usuarios SET nome = $1, email = $2 WHERE id = $3 RETURNING id, nome, email';
        resultado = await db.query(query, [nome, email.toLowerCase(), id]);
      }

      return res.status(200).json({
        mensagem: "Perfil atualizado!",
        usuario: resultado.rows[0]
      });
    } catch (error) {
      return res.status(400).json({ error: "Erro ao atualizar perfil." });
    }
  },

  // 5. Salvar Treino Realizado (GARANTA QUE ESTÁ AQUI DENTRO, SEPARADO POR VÍRGULA)
  async salvarTreinoRealizado(req, res) {
    try {
      const { id } = req.params;
      const { rotina_id, esforco } = req.body;

      const query = `
        INSERT INTO historico_treinos (usuario_id, rotina_id, percepcao_esforco)
        VALUES ($1, $2, $3) RETURNING *
      `;
      await db.query(query, [id, rotina_id, esforco]);

      return res.status(201).json({ mensagem: "Treino registrado no histórico!" });
    } catch (error) {
      return res.status(400).json({ error: "Erro ao salvar histórico." });
    }
  },

  async buscarHistorico(req, res) {
    try {
      const { id } = req.params;
      
      // Validação rápida de UUID para evitar travamentos por parâmetros inválidos
      if (!id || id === 'undefined') {
        return res.status(400).json({ error: "ID do usuário inválido ou ausente." });
      }

      const query = `
        SELECT h.*, r.nome as rotina_nome
        FROM historico_treinos h
        JOIN rotinas r ON h.rotina_id = r.id
        WHERE h.usuario_id = $1
        ORDER BY h.data_realizacao DESC
      `;
      const resultado = await db.query(query, [id]);
      
      // Sempre retorna status 200, mesmo que o array venha vazio []
      return res.status(200).json(resultado.rows);
    } catch (error) {
      console.error("❌ Erro fatal dentro do buscarHistorico no Node:", error);
      // ESSA LINHA ABAIXO IMPEDE O LOOP INFINITO CASO O BANCO DE ERRO:
      return res.status(500).json({ error: "Erro interno no servidor ao processar histórico." });
    }
  },

  // Processa o Quiz Inicial e define o Perfil Clínico
  async submeterAvaliacao(req, res) {
    try {
      const { id } = req.params;
      const { aceitouAvisoMedico, respostas, limitacoesFisicas } = req.body;

      const resultado = await Usuario.salvarAvaliacao(id, {
        aceitouAvisoMedico,
        respostas,
        limitacoesFisicas
      });

      return res.status(200).json({
        mensagem: "Avaliação processada com sucesso!",
        perfil: resultado.perfil_clinico,
        usuario: resultado
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
};

module.exports = UsuarioController;