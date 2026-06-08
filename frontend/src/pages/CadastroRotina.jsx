import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function CadastroRotina() {
  const [nome, setNome] = useState('');
  const [duracao, setDuracao] = useState('');
  const [perfilAlvo, setPerfilAlvo] = useState('SEDENTARIO');
  const [exerciciosDisponiveis, setExerciciosDisponiveis] = useState([]);
  const [exerciciosSelecionados, setExerciciosSelecionados] = useState([]);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const navigate = useNavigate();

  // Carrega os exercícios existentes para vinculação automática
// ... dentro de src/pages/CadastroRotina.jsx
useEffect(() => {
    api.get('/exercicios')
      .then(res => setExerciciosDisponiveis(res.data))
      .catch(() => setExerciciosDisponiveis([
        { id: 'a0000000-0000-0000-0000-000000000001', nome: 'Alongamento de Braços' },
        { id: 'b0000000-0000-0000-0000-000000000002', nome: 'Apoio Unipodal Simples' }
      ]));
  }, []);
  
  const handleCheckboxChange = (id) => {
    if (exerciciosSelecionados.includes(id)) {
      setExerciciosSelecionados(exerciciosSelecionados.filter(exId => exId !== id));
    } else {
      setExerciciosSelecionados([...exerciciosSelecionados, id]);
    }
  };

  const handleSalvarRotina = async (e) => {
    e.preventDefault();
    setErro(''); setSucesso('');

    try {
      await api.post('/rotinas', {
        nome,
        duracao_total: Number(duracao),
        perfil_alvo: perfilAlvo,
        exerciciosIds: exerciciosSelecionados // Envia os IDs selecionados do front
      });

      setSucesso('Rotina estruturada e salva com sucesso!');
      navigate('/admin/rotinas');
    } catch (error) {
      setErro(error.response?.data?.error || 'Erro ao criar rotina.');
    }
  };

  return (
    <div className="container">
      <h2>Montar Nova Rotina ⏱️</h2>
      <form onSubmit={handleSalvarRotina}>
        <div className="form-group">
          <label>Nome da Rotina:</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Duração (10 a 30 min):</label>
          <input type="number" value={duracao} onChange={(e) => setDuracao(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Perfil Clínico:</label>
          <select value={perfilAlvo} onChange={(e) => setPerfilAlvo(e.target.value)}>
            <option value="SEDENTARIO">Sedentário</option>
            <option value="ATIVO_LEVE">Ativo Leve</option>
          </select>
        </div>

        {/* COMPOSIÇÃO DE EXERCÍCIOS */}
        <div className="form-group">
          <label>Selecione os Exercícios desta Rotina:</label>
          <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px' }}>
            {exerciciosDisponiveis.map(ex => (
              <label key={ex.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'normal', marginBottom: '6px' }}>
                <input 
                  type="checkbox" 
                  checked={exerciciosSelecionados.includes(ex.id)}
                  onChange={() => handleCheckboxChange(ex.id)}
                />
                {ex.nome}
              </label>
            ))}
          </div>
        </div>

        <button type="submit">Salvar Composição</button>
        <button type="button" style={{ marginTop: '10px', backgroundColor: '#64748b' }} onClick={() => navigate('/admin/rotinas')}>
          Cancelar
        </button>

        {sucesso && <p className="success-msg">{sucesso}</p>}
        {erro && <p className="error-msg">{erro}</p>}
      </form>
    </div>
  );
}