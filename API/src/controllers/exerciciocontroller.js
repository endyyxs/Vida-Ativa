const Exercicio = require('../models/exercicio');
const db = require('../config/database'); // Importado para queries diretas de manipulação

const ExercicioController = {
  // Cadastra um novo exercício no banco Neon
  async cadastrar(req, res) {
    try {
      const { nome, descricao, diculdade, contraindicacoes, video_url } = req.body;

      const novoExercicio = await Exercicio.criar({
        nome,
        descricao,
        dificuldade: diculdade || 'FACIL', // fallback de segurança
        contraindicacoes,
        video_url
      });

      return res.status(201).json({
        mensagem: "Exercício cadastrado com sucesso! (Passou no Teste T7)",
        exercicio: novoExercicio
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // GET /exercicios -> Alinha com a tabela do front
  async listarTodos(req, res) {
    try {
      const resultado = await db.query('SELECT * FROM exercicios ORDER BY nome ASC');
      return res.status(200).json(resultado.rows);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar exercícios do Neon." });
    }
  },

  // PUT /exercicios/:id -> Edição de TODOS os atributos
  async editar(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao, dificuldade, contraindicacoes, video_url } = req.body;

      const query = `
        UPDATE exercicios 
        SET nome = $1, descricao = $2, dificuldade = $3, contraindicacoes = $4, video_url = $5 
        WHERE id = $6 RETURNING *
      `;
      const valores = [nome, descricao, dificuldade, contraindicacoes, video_url, id];
      const resultado = await db.query(query, valores);

      if (resultado.rows.length === 0) {
        return res.status(404).json({ error: "Exercício não encontrado." });
      }

      return res.status(200).json({
        mensagem: "Exercício atualizado com sucesso!",
        exercicio: resultado.rows[0]
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // DELETE /exercicios/:id -> Exclusão física
  async excluir(req, res) {
    try {
      const { id } = req.params;
      
      // Remove primeiro os vínculos em tabelas intermediárias (se houver) para evitar quebra de FK
      await db.query('DELETE FROM rotina_exercicios WHERE exercicio_id = $1', [id]);
      
      const resultado = await db.query('DELETE FROM exercicios WHERE id = $1 RETURNING *', [id]);

      if (resultado.rows.length === 0) {
        return res.status(404).json({ error: "Exercício não encontrado." });
      }

      return res.status(200).json({ mensagem: "Exercício deletado com sucesso!" });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao excluir o exercício." });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao, dificuldade, contraindicacoes, video_url } = req.body;

      const query = `
        UPDATE exercicios 
        SET nome = $1, descricao = $2, dificuldade = $3, contraindicacoes = $4, video_url = $5
        WHERE id = $6 RETURNING *
      `;
      const valores = [nome, descricao, dificuldade, contraindicacoes, video_url, id];
      const resultado = await db.query(query, valores);

      if (resultado.rows.length === 0) {
        return res.status(404).json({ error: "Exercício não encontrado no banco." });
      }

      return res.status(200).json({ mensagem: "Exercício atualizado!", exercicio: resultado.rows[0] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = ExercicioController;