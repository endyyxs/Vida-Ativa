const db = require('../config/database');

const Usuario = {
  // Busca o usuário no banco Neon e valida a senha em texto limpo para o escopo acadêmico
  async autenticar(email, senha) {
    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const resultado = await db.query(query, [email.toLowerCase().trim()]);
    const usuario = resultado.rows[0];

    if (!usuario) {
      throw new Error('E-mail não cadastrado no sistema.');
    }

    if (usuario.senha !== senha) {
      throw new Error('Senha incorreta. Tente novamente.');
    }

    // Remove a senha do objeto de retorno por boa prática de segurança
    delete usuario.senha;
    return usuario;
  },

  // Processa as regras de negócio do Quiz Clínico (Testes T6 e TF6)
  async salvarAvaliacao(usuarioId, { aceitouAvisoMedico, respostas, limitacoesFisicas }) {
    // Regra do Teste TF6: Se o idoso não aceitar o termo de responsabilidade médica, barra o fluxo
    if (!aceitouAvisoMedico) {
      throw new Error('É obrigatório aceitar o aviso de responsabilidade médica para prosseguir.');
    }

    // Lógica simplificada de pontuação para classificação (Regra do Teste T6)
    // Se respondeu 'sim' (com dor/dificuldade) para mais de 2 perguntas, classifica como SEDENTÁRIO
    const respostasSim = Object.values(respostas).filter(val => val === 'sim' || val === true).length;
    
    let perfilClinico = 'ATIVO_LEVE';
    if (respostasSim >= 2) {
      perfilClinico = 'SEDENTARIO';
    }

    // Salva o resultado, as limitações físicas em string (separadas por vírgula) e marca que fez o quiz
    const query = `
      UPDATE usuarios 
      SET perfil_clinico = $1, 
          limitacoes_fisicas = $2, 
          respondeu_quiz = true 
      WHERE id = $3 
      RETURNING id, tipo, nome, email, perfil_clinico, limitacoes_fisicas, respondeu_quiz
    `;
    
    const resultado = await db.query(query, [perfilClinico, limitacoesFisicas, usuarioId]);
    
    if (resultado.rows.length === 0) {
      throw new Error('Usuário não encontrado para aplicar a avaliação.');
    }

    return resultado.rows[0];
  }
};

module.exports = Usuario;