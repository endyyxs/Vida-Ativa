import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate(); // Instanciação correta da navegação

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const response = await api.post('/usuarios/login', { 
        email: email.toLowerCase(), // Proteção contra maiúsculas
        senha 
      });
      onLoginSuccess(response.data.usuario);
    } catch (error) {
      setErro(error.response?.data?.error || 'Credenciais inválidas.');
    }
  };

  return (
    <div className="container">
      <h2>Vida Ativa - Entrar 🔒</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">E-mail:</label>
          <input 
            id="email"
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="senha">Senha:</label>
          <input 
            id="senha"
            type="password" 
            value={senha} 
            onChange={(e) => setSenha(e.target.value)} 
            required 
          />
        </div>

        <button type="submit" className="btn-success">Entrar</button>

        <p style={{ marginTop: '20px', fontSize: '15px', color: '#64748b', textAlign: 'center' }}>
          Não tem uma conta?{' '}
          <span 
            style={{ color: '#0284c7', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }} 
            onClick={() => navigate('/cadastro')}
          >
            Cadastre-se aqui
          </span>
        </p>

        {erro && <p className="error-msg">{erro}</p>}
      </form>
    </div>
  );
}