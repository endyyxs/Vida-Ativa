const db = require('../config/database');

const RegistroTreino = {
  // Valida os dados do log antes de registrar no banco (RF11 / Testes TF19 e TF20)
  validar(dados) {
    const { usuario_id, rotina_id, feedback_dificuldade } = dados;

    if (!usuario_id) throw new Error("O ID do usuário é obrigatório.");
    if (!rotina_id) throw new Error("O ID da rotina é obrigatório.");

    // TF19 e TF20: Valida se o feedback veio em branco ou com texto livre inválido
    const feedbacksValidos = ['FACIL', 'MODERADO', 'DIFICIL'];
    if (!feedback_dificuldade || !feedbacksValidos.includes(feedback_dificuldade.toUpperCase())) {
      throw new Error("Feedback de dificuldade inválido. Escolha entre FACIL, MODERADO ou DIFICIL.");
    }

    return true;
  },

  // RF10: Grava a conclusão do treino e o feedback no histórico
  async registrar(dados) {
    this.validar(dados);
    const { usuario_id, rotina_id, feedback_dificuldade, status_conclusao } = dados;

    const queryText = `
      INSERT INTO registro_treinos (usuario_id, rotina_id, status_conclusao, feedback_dificuldade)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    
    const values = [
      usuario_id, 
      rotina_id, 
      status_conclusao || 'CONCLUIDO', 
      feedback_dificuldade.toUpperCase()
    ];

    const { rows } = await db.query(queryText, values);
    return rows[0];
  },

  // RF12 & RF13: Busca o histórico de um usuário para alimentar o Dashboard e a visão do Familiar
  async buscarPorUsuario(usuarioId) {
    const queryText = `
      SELECT 
        rt.id,
        rt.data_execucao,
        rt.status_conclusao,
        rt.feedback_dificuldade,
        r.nome AS nome_rotina,
        r.duracao_total
      FROM registro_treinos rt
      JOIN rotinas r ON rt.rotina_id = r.id
      WHERE rt.usuario_id = $1
      ORDER BY rt.data_execucao DESC;
    `;

    const { rows } = await db.query(queryText, [usuarioId]);
    return rows;
  }
};

module.exports = RegistroTreino;