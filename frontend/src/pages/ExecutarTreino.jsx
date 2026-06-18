import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ExecutarTreino() {
  const location = useLocation();
  const navigate = useNavigate();
  const { rotina } = location.state || { rotina: { nome: 'Treino', duracao_total: 15 } };

  return (
    <div className="container" style={{ textAlign: 'center' }}>
      <h2>Executando: {rotina.nome} 🏋️‍♂️</h2>
      <div style={{ backgroundColor: '#e2e8f0', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <p>⏱️ **Duração:** {rotina.duracao_total} minutos</p>
        <div style={{ width: '100%', height: '200px', backgroundColor: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px' }}>
          [ Player de Vídeo em Andamento ]
        </div>
      </div>
      <button id="btn-concluir-treino" className="btn-success" onClick={() => navigate('/feedback', { state: { rotina } })} data-testid="treino-concluir-button">
        ✅ Concluir Treino
      </button>
    </div>
  );
}