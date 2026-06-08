import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function FeedbackTreino({ usuarioId }) {
  const [dificuldade, setDificuldade] = useState('MODERADO');
  const location = useLocation();
  const navigate = useNavigate();
  const { rotina } = location.state || {};

  const finalizarTreino = async (e) => {
    // 1. Impede o recarregamento da página (Evita o deslogamento automático)
    e.preventDefault(); 

    if (!usuarioId) {
      alert("Erro: Usuário não identificado. Faça login novamente.");
      navigate('/');
      return;
    }

    if (!rotina?.id) {
      alert("Erro: Nenhuma rotina identificada para salvar o progresso.");
      navigate('/dashboard');
      return;
    }

    try {
      // 2. Utiliza o 'usuarioId' correto passado via props e envia o estado do select
      await api.post(`/usuarios/${usuarioId}/historico`, {
        rotina_id: rotina.id,
        esforco: dificuldade // Passa o valor dinâmico escolhido pelo idoso (FACIL, MODERADO, DIFICIL)
      });

      alert("Treino finalizado com sucesso! Parabéns por se manter ativo! 🎉");
      navigate('/historico'); // Redireciona para ver o calendário atualizado
    } catch (err) {
      console.error("Erro ao salvar histórico no Neon:", err);
      alert("Erro ao salvar seu progresso no banco de dados.");
    }
  };

  return (
    <div className="container">
      <h2>Como foi o treino hoje? 📝</h2>
      <p style={{ textAlign: 'center', color: '#64748b' }}>Sua opinião é muito importante para avaliarmos seu esforço.</p>
      
      <form onSubmit={finalizarTreino}>
        <div className="form-group" style={{ marginTop: '20px' }}>
          <label htmlFor="feedback" style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
            Selecione o nível de esforço que você sentiu:
          </label>
          <select 
            id="feedback" 
            value={dificuldade} 
            onChange={(e) => setDificuldade(e.target.value)} 
            data-testid="feedback-dificuldade-select"
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          >
            <option value="FACIL">🟢 Fácil (Bem tranquilo)</option>
            <option value="MODERADO">🟡 Moderado (Senti o exercício, mas foi bom)</option>
            <option value="DIFICIL">🔴 Difícil (Exigiu bastante esforço)</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="btn-success" 
          data-testid="feedback-submit-button"
          style={{ marginTop: '25px', width: '100%' }}
        >
          Salvar e Finalizar Treino 🏁
        </button>
      </form>
    </div>
  );
}