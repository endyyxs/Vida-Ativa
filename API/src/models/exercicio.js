const db = require('../config/database');

const Exercicio = {
  // Insere um novo exercício validando preenchimento mínimo (Regra do Teste T7)
  async criar({ nome, descricao, dificuldade, contraindicacoes, video_url }) {
    if (!nome || nome.trim() === '') {
      throw new Error('O nome do exercício é um campo obrigatório.');
    }
    if (!descricao || descricao.trim() === '') {
      throw new Error('As instruções/descrição do exercício são obrigatórias.');
    }

    const query = `
      INSERT INTO exercicios (nome, descricao, dificuldade, contraindicacoes, video_url)
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;
    const valores = [
      nome.trim(), 
      descricao.trim(), 
      dificuldade || 'FACIL', 
      contraindicacoes ? contraindicacoes.toLowerCase().trim() : null, 
      video_url || null
    ];

    const resultado = await db.query(query, valores);
    return resultado.rows[0];
  }
};

module.exports = Exercicio;