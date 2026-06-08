import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function HistoricoProgresso({ usuario }) {
  const navigate = useNavigate();
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    console.log("🔍 Rastreamento do Histórico - Objeto usuário recebido:", usuario);

    // Se o estado do usuário ainda não foi carregado da memória pelo app, espera um pouco
    if (usuario === undefined) {
      return; 
    }

    // SE O USUÁRIO EXISTE MAS NÃO TEM ID (OU NÃO ESTÁ LOGADO)
    if (!usuario || !usuario.id) {
      console.warn("⚠️ Usuário sem ID válido ou deslogado.");
      setErro("Usuário não identificado. Verifique se realizou o login corretamente.");
      setCarregando(false);
      return;
    }

    // SE CHEGOU AQUI, TEMOS O ID EM MÃOS, VAMOS CHAMAR A API
    console.log(`🚀 Fazendo requisição para: /usuarios/${usuario.id}/historico`);
    
    api.get(`/usuarios/${usuario.id}/historico`)
      .then(res => {
        console.log("✅ Dados do histórico recebidos com sucesso:", res.data);
        setHistorico(res.data);
        setCarregando(false);
      })
      .catch(err => {
        console.error("❌ Erro retornado pela API de histórico:", err);
        setErro(err.response?.data?.error || "Não foi possível carregar os registros do banco Neon.");
        setCarregando(false);
      });
  }, [usuario, usuario?.id]); // Monitora as mudanças de estado

  // Função para formatar a data que vem do banco
  const formatarData = (dataISO) => {
    if (!dataISO) return "Data indisponível";
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  };

  if (carregando) {
    return (
      <div className="container" style={{ textAlign: 'center' }}>
        <h3>🔄 Carregando seu calendário de progresso...</h3>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Seu Calendário de Atividades 📅</h2>
      <p style={{ textAlign: 'center' }}>Veja os dias em que você se manteve ativo!</p>

      {erro && (
        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '6px', marginTop: '15px', textAlign: 'center', fontWeight: 'bold' }}>
          ⚠️ {erro}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '25px' }}>
        {!erro && historico.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>
            Você ainda não realizou nenhum treino. Escolha uma rotina no painel e comece hoje!
          </p>
        ) : (
          historico.map((log) => (
            <div 
              key={log.id} 
              style={{ 
                border: '2px solid #16a34a', 
                borderRadius: '8px', 
                padding: '15px',
                backgroundColor: '#f0fdf4',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <span style={{ fontSize: '14px', color: '#64748b', display: 'block' }}>
                  {formatarData(log.data_realizacao)}
                </span>
                <strong style={{ fontSize: '18px', color: '#16a34a' }}>
                  ✅ {log.rotina_nome || 'Treino Concluído'}
                </strong>
              </div>
              
              <span style={{ fontSize: '14px', backgroundColor: '#e2e8f0', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' }}>
                💪 Esforço: {log.percepcao_esforco}
              </span>
            </div>
          ))
        )}
      </div>

      <button type="button" style={{ marginTop: '30px', backgroundColor: '#64748b', width: '100%' }} onClick={() => navigate('/dashboard')}>
        Voltar para o Início
      </button>
    </div>
  );
}