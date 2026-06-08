const { Pool } = require('pg');
require('dotenv').config();

// Inicializa o pool configurando o SSL para conexões em nuvem
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // Essencial para o Neon: aceita o certificado seguro da nuvem
    rejectUnauthorized: false, 
  },
  // Configurações de tolerância a falhas
  max: 10,                 // Máximo de conexões no pool
  idleTimeoutMillis: 30000, // Tempo para fechar conexões ociosas
  connectionTimeoutMillis: 5000, // Tempo limite para conseguir uma conexão antes de dar erro
});

// Impede que o erro ECONNRESET quebre o processo do Node de forma abrupta
pool.on('error', (err, client) => {
  console.error('⚠️ Erro inesperado em uma conexão ociosa do banco:', err.message);
  if (err.message.includes('ECONNRESET')) {
    console.log('🔄 Tentando reestabelecer o canal de comunicação com o Neon...');
  }
});

// Teste inicial de conexão adaptado para o tempo de resposta (wake up) do Neon
async function testarConexao() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('🚀 Conexão com o banco Neon estabelecida com sucesso!');
  } catch (err) {
    console.error('❌ Erro na primeira tentativa de conexão com o Neon:', err.message);
    console.log('💡 Dica: Se o banco estava suspenso (idle), aguarde 5 segundos e reinicie a API com "npm start".');
  }
}

testarConexao();

module.exports = {
  query: (text, params) => pool.query(text, params),
};