import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomeAdmin({ usuario }) {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ textAlign: 'center' }}>
      <h1>Painel Administrativo 🛠️</h1>
      <p>Olá, <strong>{usuario.nome}</strong>. O que você deseja gerenciar hoje?</p>
      
      <hr style={{ margin: '20px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button 
          style={{ padding: '16px', fontSize: '18px', backgroundColor: '#0284c7' }}
          onClick={() => navigate('/admin/exercicios')}
        >
          🏋️‍♂️ Gerenciar Banco de Exercícios
        </button>

        <button 
          style={{ padding: '16px', fontSize: '18px', backgroundColor: '#0284c7' }}
          onClick={() => navigate('/admin/rotinas')}
        >
          ⏱️ Gerenciar Rotinas de Treino
        </button>
      </div>
    </div>
  );
}