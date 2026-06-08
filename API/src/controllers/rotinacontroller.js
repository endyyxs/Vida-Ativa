const Rotina = require('../models/rotina');
const db = require('../config/database');

const RotinaController = {
  // Cria uma rotina de treinos associando exercícios
  async cadastrar(req, res) {
    try {
      const { nome, duracao_total, perfil_alvo, exerciciosIds } = req.body;

      const novaRotina = await Rotina.criar({
        nome,
        duracao_total,
        perfil_alvo,
        exerciciosIds
      });

      return res.status(201).json({
        mensagem: "Rotina criada com sucesso!",
        rotina: novaRotina
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;

      // 1. Busca os dados principais da rotina
      const resRotina = await db.query('SELECT * FROM rotinas WHERE id = $1', [id]);
      const rotina = resRotina.rows[0];

      if (!rotina) {
        return res.status(404).json({ error: "Rotina de treinos não encontrada." });
      }

      // 2. Busca todos os exercícios associados a essa rotina respeitando a ordem correta
      const queryExercicios = `
        SELECT e.*, re.ordem_execucao 
        FROM exercicios e
        JOIN rotina_exercicios re ON e.id = re.exercicio_id
        WHERE re.rotina_id = $1
        ORDER BY re.ordem_execucao ASC
      `;
      const resExercicios = await db.query(queryExercicios, [id]);

      // 3. Monta o payload final acoplando o array de exercícios no objeto da rotina
      rotina.exercicios = resExercicios.rows;

      return res.status(200).json(rotina);
    } catch (error) {
      return res.status(500).json({ error: "Erro interno ao buscar detalhes da rotina." });
    }
  },

  // GET /rotinas -> Alinha com a tabela de gerenciamento do admin
  async listarTodas(req, res) {
    try {
      const resultado = await db.query('SELECT * FROM rotinas ORDER BY id DESC');
      return res.status(200).json(resultado.rows);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar lista de rotinas." });
    }
  },

  // PUT /rotinas/:id -> Permite atualizar o escopo e atributos da rotina
  async editar(req, res) {
    try {
      const { id } = req.params;
      const { nome, duracao_total, perfil_alvo } = req.body;

      const query = `
        UPDATE rotinas 
        SET nome = $1, duracao_total = $2, perfil_alvo = $3 
        WHERE id = $4 RETURNING *
      `;
      const resultado = await db.query(query, [nome, Number(duracao_total), perfil_alvo, id]);

      if (resultado.rows.length === 0) {
        return res.status(404).json({ error: "Rotina não encontrada." });
      }

      return res.status(200).json({
        mensagem: "Rotina atualizada com sucesso!",
        rotina: resultado.rows[0]
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // DELETE /rotinas/:id -> Limpa a tabela N:N e remove a rotina de vez
  async excluir(req, res) {
    try {
      const { id } = req.params;

      // 1. Limpa os vínculos na tabela intermediária primeiro (Garante Integridade Referencial)
      await db.query('DELETE FROM rotina_exercicios WHERE rotina_id = $1', [id]);

      // 2. Remove a linha principal da rotina
      const resultado = await db.query('DELETE FROM rotinas WHERE id = $1 RETURNING *', [id]);

      if (resultado.rows.length === 0) {
        return res.status(404).json({ error: "Rotina não encontrada." });
      }

      return res.status(200).json({ mensagem: "Rotina removida do acervo." });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao excluir a rotina." });
    }
  },

  // FILTRO CRÍTICO SEGURANÇA (RF08 / RN03)
  async buscarRecomendadas(req, res) {
    try {
      const { usuarioId } = req.query;

      if (!usuarioId) {
        return res.status(400).json({ error: "O ID do usuário é obrigatório." });
      }

      const resUsuario = await db.query('SELECT perfil_clinico, limitacoes_fisicas FROM usuarios WHERE id = $1', [usuarioId]);
      const usuario = resUsuario.rows[0];

      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      const perfil = usuario.perfil_clinico || 'SEDENTARIO';
      const limitacoes = usuario.limitacoes_fisicas ? usuario.limitacoes_fisicas.split(',') : [];

      const queryRotinas = `
        SELECT r.*, 
               ARRAY_AGG(e.contraindicacoes) as contraindicacoes_exercicios
        FROM rotinas r
        JOIN rotina_exercicios re ON r.id = re.rotina_id
        JOIN exercicios e ON re.exercicio_id = e.id
        WHERE r.perfil_alvo = $1
        GROUP BY r.id;
      `;
      const resRotinas = await db.query(queryRotinas, [perfil]);
      const rotinasDoPerfil = resRotinas.rows;

      const rotinasSeguras = rotinasDoPerfil.filter(rotina => {
        const todasContraindicacoes = rotina.contraindicacoes_exercicios.join(',');
        const possuiRisco = limitacoes.some(lim => todasContraindicacoes.includes(lim));
        return !possuiRisco;
      });

      return res.status(200).json(rotinasSeguras);

    } catch (error) {
      return res.status(500).json({ error: "Erro interno ao processar treinos recomendados." });
    }
  },

  async atualizar(req, res) {
    const { id } = req.params;
    const { nome, duracao_total, perfil_alvo, exerciciosIds } = req.body;

    await db.query('BEGIN');
    try {
      // 1. Atualiza os dados básicos da rotina
      await db.query(
        'UPDATE rotinas SET nome = $1, duracao_total = $2, perfil_alvo = $3 WHERE id = $4',
        [nome, duracao_total, perfil_alvo, id]
      );

      // 2. Se o front enviou a lista de exercícios, limpa os antigos e insere os novos
      if (exerciciosIds) {
        await db.query('DELETE FROM rotina_exercicios WHERE rotina_id = $1', [id]);
        
        const queryVinculo = 'INSERT INTO rotina_exercicios (rotina_id, exercicio_id, ordem_execucao) VALUES ($1, $2, $3)';
        for (const [index, exId] of exerciciosIds.entries()) {
          await db.query(queryVinculo, [id, exId, index + 1]);
        }
      }

      await db.query('COMMIT');
      return res.status(200).json({ mensagem: "Rotina atualizada com sucesso!" });
    } catch (error) {
      await db.query('ROLLBACK');
      return res.status(500).json({ error: "Erro ao atualizar rotina no banco." });
    }
  }
};

module.exports = RotinaController;