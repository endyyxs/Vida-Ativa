const db = require('../config/database');

const Rotina = {
    async criar({ nome, duracao_total, perfil_alvo, exerciciosIds }) {
        // Validações de Escopo Acadêmico
        if (!nome || nome.trim() === '') {
          throw new Error('O nome da rotina é obrigatório.');
        }
        if (duracao_total < 10 || duracao_total > 30) {
          throw new Error('Por segurança clínica, a duração da rotina deve ser entre 10 e 30 minutos.');
        }
        if (!exerciciosIds || exerciciosIds.length === 0) {
          throw new Error('Uma rotina precisa ter pelo menos um exercício vinculado.');
        }
    
        // Inicia uma Transação no Postgres
        await db.query('BEGIN');
    
        try {
          // 1. Insere a Rotina Principal
          const queryRotina = `
            INSERT INTO rotinas (nome, duracao_total, perfil_alvo)
            VALUES ($1, $2, $3) RETURNING *
          `;
          const resRotina = await db.query(queryRotina, [nome.trim(), Number(duracao_total), perfil_alvo || 'SEDENTARIO']);
          const novaRotina = resRotina.rows[0];
    
          // 2. Vincula cada ID de exercício preenchendo a coluna ordem_execucao dinamicamente
          const queryVinculo = `
            INSERT INTO rotina_exercicios (rotina_id, exercicio_id, ordem_execucao)
            VALUES ($1, $2, $3)
          `;
    
          // Usando for...of com entries() para capturar o índice (posição) do array de IDs
          for (const [index, exId] of exerciciosIds.entries()) {
            const ordem = index + 1; // O primeiro exercício será a ordem 1, o segundo 2, etc.
            await db.query(queryVinculo, [novaRotina.id, exId, ordem]);
          }
    
          // Confirma todas as alterações no Neon
          await db.query('COMMIT');
          
          return novaRotina;
    
        } catch (error) {
          // Caso ocorra qualquer erro, desfaz tudo para manter o banco limpo
          await db.query('ROLLBACK');
          throw new Error('Falha operacional ao vincular os exercícios à rotina: ' + error.message);
        }
      }
};

module.exports = Rotina;