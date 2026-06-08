import React, { useState } from 'react';
import api from '../services/api';

export default function MeuPerfil({ usuario, onUpdateUsuario }) {
  const [nome, setNome] = useState(usuario?.nome || '');
  const [email, setEmail] = useState(usuario?.email || '');
  const [senha, setSenha] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');

  const handleAtualizarPerfil = async (e) => {
    e.preventDefault();
    setErro(''); setSucesso('');

    try {
      // Rota genérica que criaremos para atualizar a conta logada
      const res = await api.put(`/usuarios/${usuario.id}`, { nome, email, senha });
      setSucesso('Perfil atualizado com sucesso!');
      
      // Atualiza o estado global no App.jsx para refletir o novo nome na Navbar
      if (onUpdateUsuario) {
        onUpdateUsuario({ ...usuario, nome, email });
      }
    } catch (err) {
      setErro('Erro ao atualizar os dados no servidor.');
    }
  };

  return (
    <div className="container">
      <h2>Meu Perfil 👤</h2>
      <p>Gerencie as credenciais da sua conta **{usuario?.tipo}**.</p>
      
      <form onSubmit={handleAtualizarPerfil} style={{ marginTop: '20px' }}>
        <div className="form-group">
          <label>Nome Completo:</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>E-mail de Acesso:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Nova Senha (deixe em branco para manter a atual):</label>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" />
        </div>

        <button type="submit" className="btn-success">Atualizar Dados</button>
        {sucesso && <p className="success-msg">{sucesso}</p>}
        {erro && <p className="error-msg">{erro}</p>}
      </form>
    </div>
  );
}