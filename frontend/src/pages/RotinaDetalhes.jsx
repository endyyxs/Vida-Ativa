import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function RotinaDetalhes() {
  const location = useLocation();
  const navigate = useNavigate();
  const { rotina: rotinaResumida } = location.state || {};

  // Estados para armazenar os dados dinâmicos vindos do Neon
  const [exerciciosDaRotina, setExerciciosDaRotina] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!rotinaResumida?.id) {
      setCarregando(false);
      return;
    }

    // Busca os dados completos da rotina (incluindo seus exercícios N:N)
    api.get(`/rotinas/${rotinaResumida.id}`)
      .then((response) => {
        // Guarda os exercícios que vieram acoplados pelo back-end
        setExerciciosDaRotina(response.data.exercicios || []);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao puxar dados da rotina:", err);
        setErro("Não foi possível carregar os exercícios desta rotina.");
        setCarregando(false);
      });
  }, [rotinaResumida]);

  if (!rotinaResumida) {
    return (
      <div className="container">
        <p>Nenhuma rotina selecionada no painel.</p>
        <button onClick={() => navigate('/dashboard')}>Voltar ao Início</button>
      </div>
    );
  }

  if (carregando) {
    return (
      <div className="container" style={{ textAlign: 'center' }}>
        <h3>🔄 Carregando treino personalizado...</h3>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Detalhes do Treino 📺</h2>
      <h3 style={{ color: '#0284c7' }}>{rotinaResumida.nome}</h3>
      <p style={{ fontWeight: 'bold' }}>⏱️ Duração Estimada Total: {rotinaResumida.duracao_total} min</p>
      
      <hr />
      
      <h4>📋 Exercícios Inclusos nesta Rotina:</h4>
      
      {erro && <p className="error-msg">{erro}</p>}

      {exerciciosDaRotina.length === 0 && !erro ? (
        <p style={{ color: '#64748b', fontStyle: 'italic' }}>Nenhum exercício vinculado a esta rotina ainda.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '15px' }}>
          {exerciciosDaRotina.map((ex, index) => (
            <div key={ex.id} style={{ border: '1px solid #cbd5e1', padding: '15px', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
              <strong style={{ fontSize: '18px', color: '#0f172a' }}>
                {index + 1}. {ex.nome}
              </strong>
              
              {ex.dificuldade && (
                <span style={{ marginLeft: '10px', fontSize: '12px', padding: '2px 6px', borderRadius: '4px', background: '#e2e8f0', fontWeight: 'bold' }}>
                  {ex.dificuldade}
                </span>
              )}

              <p style={{ fontSize: '15px', color: '#334155', margin: '8px 0' }}>{ex.descricao}</p>
              
              {/* Player de Vídeo Dinâmico do Neon */}
              {ex.video_url && (
                <div style={{ marginTop: '10px', borderRadius: '6px', overflow: 'hidden', background: '#000' }}>
                  <iframe
                    width="100%"
                    height="180"
                    src={ex.video_url}
                    title={ex.nome}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
        <button 
          className="btn-success" 
          disabled={exerciciosDaRotina.length === 0}
          onClick={() => navigate('/treino', { state: { rotina: { ...rotinaResumida, exercicios: exerciciosDaRotina } } })}
        >
          ▶️ Iniciar Este Treino Agora
        </button>
        
        <button style={{ backgroundColor: '#64748b' }} onClick={() => navigate('/dashboard')}>
          Voltar
        </button>
      </div>
    </div>
  );
}