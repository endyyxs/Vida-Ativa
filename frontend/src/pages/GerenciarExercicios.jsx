import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function GerenciarExercicios() {
  const [exercicios, setExercicios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  // Busca os exercícios reais do banco Neon
  useEffect(() => {
    api.get('/exercicios')
      .then(res => {
        setExercicios(res.data);
        setCarregando(false);
      })
      .catch(err => {
        console.error("Erro ao buscar exercícios:", err);
        // Fallback mockado caso o banco esteja inacessível no Wi-Fi da faculdade
        setExercicios([
          { id: 1, nome: 'Alongamento de Braços', dificuldade: 'FACIL', contraindicacoes: '' },
          { id: 2, nome: 'Apoio Unipodal Simples', dificuldade: 'MODERADO', contraindicacoes: 'equilibrio' }
        ]);
        setCarregando(false);
      });
  }, []);

  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este exercício?")) {
      try {
        await api.delete(`/exercicios/${id}`);
        setExercicios(exercicios.filter(ex => ex.id !== id));
        alert("Exercício excluído com sucesso!");
      } catch (err) {
        alert("Erro ao excluir exercício na API.");
      }
    }
  };

  return (
    <div className="container" style={{ maxWidth: '700px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 id='listaExercicios'>Gerenciar Exercícios </h2>
        <button 
          style={{ width: 'auto', backgroundColor: '#16a34a' }}
          onClick={() => navigate('/admin/exercicio/novo')} 
          id='btnExercicio'
        >
          + Novo Exercício
        </button>
      </div>

      {carregando ? <p>Carregando...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Nome</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Dificuldade</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {exercicios.map(ex => (
              <tr key={ex.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px' }}>{ex.nome}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: ex.dificuldade === 'FACIL' ? '#16a34a' : '#0284c7' }}>
                    {ex.dificuldade}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button 
                    style={{ width: 'auto', padding: '6px 12px', backgroundColor: '#0284c7', fontSize: '14px' }}
                    onClick={() => navigate('/admin/exercicio/editar', { state: { exercicio: ex } })}
                  >
                    Editar
                  </button>
                  <button 
                    style={{ width: 'auto', padding: '6px 12px', backgroundColor: '#dc2626', fontSize: '14px' }}
                    onClick={() => handleExcluir(ex.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}