import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function DashboardIdoso({ usuario }) {
  const [recomendadas, setRecomendadas] = useState([]);
  const [outrasSugestoes, setOutrasSugestoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarDados() {
      try {
        // Busca as rotinas filtradas personalizadas para a clínica dele
        const resRec = await api.get(`/rotinas/recomendadas?usuarioId=${usuario.id}`);
        setRecomendadas(resRec.data);

        // Simulando a busca de "Outras Rotinas Gerais" do sistema para a seção de baixo
        // Na refatoração do back traremos todas as outras não-contraindicadas
        setOutrasSugestoes([
          { id: 'b0000000-0000-0000-0000-000000000002', nome: 'Treino de Postura Geral', duracao_total: 20 }
        ]);
      } catch (err) {
        console.error("Erro ao carregar o painel do idoso:", err);
      } finally {
        setCarregando(false);
      }
    }
    carregarDados();
  }, [usuario]);

  const abrirRotina = (rotina) => {
    // Navega para a tela de detalhes passando o objeto da rotina no estado da rota
    navigate('/rotina-detalhes', { state: { rotina } });
  };

  if (carregando) return <div className="container"><p>Carregando seus treinos seguros...</p></div>;

  return (
    <div className="container">
      <h1>Painel Vida Ativa 👵👴</h1>
      <p>Olá, <strong>{usuario.nome}</strong>! Perfil Clínico: <span style={{ color: '#0284c7' }}>{usuario.perfil_clinico}</span></p>

      <hr />

      {/* SEÇÃO 1: Recomendadas com base na saúde (Prioridade Máxima) */}
      <section style={{ marginTop: '20px' }}>
        <h3 style={{ color: '#16a34a', textAlign: 'left' }}>⭐ Recomendados Especialmente para Você:</h3>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '-10px' }}>Treinos totalmente compatíveis com suas restrições de saúde.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recomendadas.map(rotina => (
            <div key={rotina.id} style={{ border: '2px solid #16a34a', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f0fdf4' }}>
              <div>
                <strong>{rotina.nome}</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#64748b' }}>⏱️ {rotina.duracao_total} minutos</p>
              </div>
              <button className="btn-success" style={{ width: 'auto' }} onClick={() => abrirRotina(rotina)}>
                Ver Exercícios
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SEÇÃO 2: Outras Sugestões do Sistema */}
      <section style={{ marginTop: '35px' }}>
        <h3 style={{ color: '#0284c7', textAlign: 'left' }}>💡 Outras Sugestões Disponíveis:</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {outrasSugestoes.map(rotina => (
            <div key={rotina.id} style={{ border: '2px solid #cbd5e1', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{rotina.nome}</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#64748b' }}>⏱️ {rotina.duracao_total} minutos</p>
              </div>
              <button style={{ width: 'auto', backgroundColor: '#0284c7' }} onClick={() => abrirRotina(rotina)}>
                Ver Exercícios
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}