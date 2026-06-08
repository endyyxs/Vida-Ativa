import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function GerenciarRotinas() {
  const [rotinas, setRotinas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/rotinas')
      .then(res => {
        setRotinas(res.data);
        setCarregando(false);
      })
      .catch(err => {
        console.error("Erro ao buscar rotinas:", err);
        setRotinas([
          { id: 1, nome: 'Treino Leve de Cadeira', duracao_total: 15, perfil_alvo: 'SEDENTARIO' }
        ]);
        setCarregando(false);
      });
  }, []);

  const handleExcluir = async (id) => {
    if (window.confirm("Deseja mesmo remover esta rotina completa?")) {
      try {
        await api.delete(`/rotinas/${id}`);
        setRotinas(rotinas.filter(r => r.id !== id));
        alert("Rotina removida!");
      } catch (err) {
        alert("Erro ao remover rotina.");
      }
    }
  };

  return (
    <div className="container" style={{ maxWidth: '700px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Gerenciar Rotinas ⏱️</h2>
        <button 
          style={{ width: 'auto', backgroundColor: '#16a34a' }}
          onClick={() => navigate('/admin/rotina/nova')}
        >
          + Nova Rotina
        </button>
      </div>

      {carregando ? <p>Carregando...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Nome da Rotina</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Tempo</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {rotinas.map(rotina => (
              <tr key={rotina.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px' }}>{rotina.nome}</td>
                <td style={{ padding: '12px' }}>{rotina.duracao_total} min</td>
                <td style={{ padding: '12px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button 
                    style={{ width: 'auto', padding: '6px 12px', backgroundColor: '#0284c7', fontSize: '14px' }}
                    onClick={() => navigate('/admin/rotina/editar', { state: { rotina } })}
                  >
                    Editar
                  </button>
                  <button 
                    style={{ width: 'auto', padding: '6px 12px', backgroundColor: '#dc2626', fontSize: '14px' }}
                    onClick={() => handleExcluir(rotina.id)}
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