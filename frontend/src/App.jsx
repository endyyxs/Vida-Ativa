import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';

import Login from './pages/Login';
import CadastroUsuario from './pages/CadastroUsuario';
import AvaliacaoInicial from './pages/AvaliacaoInicial';
import DashboardIdoso from './pages/DashboardIdoso';
import RotinaDetalhes from './pages/RotinaDetalhes';
import ExecutarTreino from './pages/ExecutarTreino';
import FeedbackTreino from './pages/FeedbackTreino';
import HistoricoProgresso from './pages/HistoricoProgresso';
import MeuPerfil from './pages/MeuPerfil';

// Administrativo
import HomeAdmin from './pages/HomeAdmin';
import GerenciarExercicios from './pages/GerenciarExercicios';
import GerenciarRotinas from './pages/GerenciarRotinas';
import CadastroExercicio from './pages/CadastroExercicio';
import CadastroRotina from './pages/CadastroRotina';
import EditarItem from './pages/EditarItem';

function App() {
  const [usuario, setUsuario] = useState(null);

  return (
    <BrowserRouter>
      {usuario && (
        <nav style={{ backgroundColor: '#0f172a', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
          <span style={{ fontWeight: 'bold', fontSize: '20px' }}>Vida Ativa 💪</span>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Início</Link>
            
            {usuario.tipo === 'IDOSO' && (
              <Link to="/historico" style={{ color: 'white', textDecoration: 'none' }}>Meu Progresso</Link>
            )}
            
            {usuario.tipo === 'PROFISSIONAL' && (
              <>
                <Link to="/admin/exercicios" style={{ color: '#38bdf8', textDecoration: 'none' }}>Exercícios</Link>
                <Link to="/admin/rotinas" style={{ color: '#38bdf8', textDecoration: 'none' }}>Rotinas</Link>
              </>
            )}

            <Link to="/perfil" style={{ color: '#ae7aff', textDecoration: 'none', fontWeight: 'bold' }}>👤 Perfil</Link>
            
            <button style={{ width: 'auto', padding: '6px 12px', backgroundColor: '#dc2626', fontSize: '14px' }} onClick={() => setUsuario(null)}>
              Sair
            </button>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/" element={!usuario ? <Login onLoginSuccess={(usr) => setUsuario(usr)} /> : <Navigate to="/dashboard" />} />
        <Route path="/cadastro" element={!usuario ? <CadastroUsuario /> : <Navigate to="/dashboard" />} />
        
        <Route path="/dashboard" element={
          usuario ? (
            usuario.tipo === 'IDOSO' && !usuario.respondeu_quiz ? <Navigate to="/quiz" /> :
            usuario.tipo === 'PROFISSIONAL' ? <Navigate to="/admin/home" /> : <DashboardIdoso usuario={usuario} />
          ) : <Navigate to="/" />
        } />

        <Route path="/quiz" element={usuario ? <AvaliacaoInicial usuarioId={usuario.id} onAvaliacaoSuccess={(usr) => setUsuario(usr)} /> : <Navigate to="/" />} />
        <Route path="/rotina-detalhes" element={usuario ? <RotinaDetalhes /> : <Navigate to="/" />} />
        <Route path="/treino" element={usuario ? <ExecutarTreino /> : <Navigate to="/" />} />
        <Route path="/feedback" element={<FeedbackTreino usuarioId={usuario?.id} />} />
        <Route path="/historico" element={<HistoricoProgresso usuario={usuario} />} />
        <Route path="/perfil" element={usuario ? <MeuPerfil usuario={usuario} onUpdateUsuario={(newUsr) => setUsuario(newUsr)} /> : <Navigate to="/" />} />
        
        {/* CRUDS Administrativos */}
        <Route path="/admin/home" element={usuario?.tipo === 'PROFISSIONAL' ? <HomeAdmin usuario={usuario} /> : <Navigate to="/" />} />
        <Route path="/admin/exercicios" element={usuario?.tipo === 'PROFISSIONAL' ? <GerenciarExercicios /> : <Navigate to="/" />} />
        <Route path="/admin/exercicio/novo" element={usuario?.tipo === 'PROFISSIONAL' ? <CadastroExercicio onVoltar={() => window.location.href = '/admin/exercicios'} /> : <Navigate to="/admin/exercicios" />} />
        <Route path="/admin/exercicio/editar" element={usuario?.tipo === 'PROFISSIONAL' ? <EditarItem /> : <Navigate to="/" />} />
        
        <Route path="/admin/rotinas" element={usuario?.tipo === 'PROFISSIONAL' ? <GerenciarRotinas /> : <Navigate to="/" />} />
        <Route path="/admin/rotina/nova" element={usuario?.tipo === 'PROFISSIONAL' ? <CadastroRotina /> : <Navigate to="/" />} />
        <Route path="/admin/rotina/editar" element={usuario?.tipo === 'PROFISSIONAL' ? <EditarItem /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;