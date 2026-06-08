import React, { useState } from 'react';
import api from '../services/api';

export default function AvaliacaoInicial({ usuarioId, onAvaliacaoSuccess }) {
  const [aceitouAviso, setAceitouAviso] = useState(false);
  const [p1, setP1] = useState('0');
  const [p2, setP2] = useState('0');
  const [limitacoes, setLimitacoes] = useState([]);
  const [erro, setErro] = useState('');

  // Gerencia a seleção de limitações físicas (checkboxes)
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setLimitacoes([...limitacoes, value]);
    } else {
      setLimitacoes(limitacoes.filter((item) => item !== value));
    }
  };

  const handleSubmeter = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const dados = {
        aceitouAvisoMedico: aceitouAviso,
        respostas: [Number(p1), Number(p2)],
        limitacoesFisicas: limitacoes
      };

      const response = await api.post(`/usuarios/${usuarioId}/avaliacao`, dados);
      alert(`Avaliação Concluída! Perfil: ${response.data.perfil}`);
      
      if (onAvaliacaoSuccess) {
        onAvaliacaoSuccess(response.data.usuario);
      }
    } catch (error) {
      // Pega o erro 400 do backend caso o aviso médico não tenha sido aceito (Valida seu teste TF6)
      setErro(error.response?.data?.error || 'Erro ao processar avaliação.');
    }
  };

  return (
    <div className="container">
      <h2>Avaliação Inicial de Saúde 📋</h2>
      
      <form onSubmit={handleSubmeter}>
        {/* Termo de Consentimento Médico (Crítico para a premissa de segurança) */}
        <div className="form-group" style={{ backgroundColor: '#fee2e2', padding: '12px', borderRadius: '6px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={aceitouAviso}
              onChange={(e) => setAceitouAviso(e.target.checked)}
              data-testid="quiz-termo-medico"
              style={{ transform: 'scale(1.5)' }}
            />
            <span>Declaro que fui liberado por um médico para realizar exercícios físicos leves.</span>
          </label>
        </div>

        {/* Questão 1 do Quiz */}
        <div className="form-group">
          <label htmlFor="p1">1. Com que frequência você pratica atividades físicas na semana?</label>
          <select id="p1" value={p1} onChange={(e) => setP1(e.target.value)} data-testid="quiz-pergunta-1">
            <option value="0">Não pratico (0 dias)</option>
            <option value="3">Pratico poucas vezes (1 a 2 dias)</option>
            <option value="5">Pratico regularmente (3 ou mais dias)</option>
          </select>
        </div>

        {/* Questão 2 do Quiz */}
        <div className="form-group">
          <label htmlFor="p2">2. Como você se sente ao caminhar por 10 minutos?</label>
          <select id="p2" value={p2} onChange={(e) => setP2(e.target.value)} data-testid="quiz-pergunta-2">
            <option value="0">Muito cansado / Falta de ar</option>
            <option value="2">Cansaço leve</option>
            <option value="4">Disposto / Sem cansaço</option>
          </select>
        </div>

        {/* Seleção de Restrições Clínicas para o Filtro de Segurança (RF08) */}
        <div className="form-group">
          <label>3. Possui alguma limitação física conhecida?</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            <label style={{ fontWeight: 'normal' }}>
              <input type="checkbox" value="equilibrio" onChange={handleCheckboxChange} data-testid="quiz-limitação-equilibrio" /> Falta de Equilíbrio
            </label>
            <label style={{ fontWeight: 'normal' }}>
              <input type="checkbox" value="joelho" onChange={handleCheckboxChange} data-testid="quiz-limitação-joelho" /> Dores nos Joelhos
            </label>
            <label style={{ fontWeight: 'normal' }}>
              <input type="checkbox" value="coluna" onChange={handleCheckboxChange} data-testid="quiz-limitação-coluna" /> Problemas na Coluna
            </label>
          </div>
        </div>

        <button type="submit" className="btn-success" data-testid="quiz-submit-button">
          Salvar Avaliação
        </button>

        {erro && <p className="error-msg" data-testid="quiz-error-message">{erro}</p>}
      </form>
    </div>
  );
}