import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function CadastroUsuario() {
  const [tipo, setTipo] = useState('IDOSO');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  // Campos Condicionais
  const [idEducador, setIdEducador] = useState('');
  const [restricoesCorpo, setRestricoesCorpo] = useState('');

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro(''); setSucesso('');

    const payload = {
      tipo,
      nome,
      email,
      senha,
      ...(tipo === 'PROFISSIONAL' ? { registro_profissional: idEducador } : { restricoes_clinicas: restricoesCorpo })
    };

    try {
      await api.post('/usuarios/cadastro', payload);
      setSucesso('Conta criada com sucesso! Redirecionando...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao realizar cadastro.');
    }
  };

  return (
    <div className="container">
      <h2>Criar Nova Conta 📑</h2>
      <p style={{ textAlign: 'center' }}>Cadastre-se para acessar a plataforma Vida Ativa.</p>

      <form onSubmit={handleCadastro} style={{ marginTop: '20px' }}>
        <div className="form-group">
          <label>Quem é você?</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={{ padding: '10px', fontSize: '16px' }}>
            <option value="IDOSO">👵👴 Sou Idoso / Aluno</option>
            <option value="PROFISSIONAL">💪 Sou Educador Físico / Admin</option>
          </select>
        </div>

        <div className="form-group">
          <label>Nome Completo:</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>E-mail:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Senha:</label>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required placeholder="Mínimo 6 caracteres" />
        </div>

        {/* INPUTS DINÂMICOS CONFORME O TIPO */}
        {tipo === 'PROFISSIONAL' ? (
          <div className="form-group" style={{ backgroundColor: '#f0f9ff', padding: '12px', borderRadius: '6px', border: '1px solid #bae6fd' }}>
            <label style={{ color: '#0369a1' }}>ID / Registro do Educador Físico (CREF):</label>
            <input type="text" value={idEducador} onChange={(e) => setIdEducador(e.target.value)} placeholder="Ex: CREF 12345-G/DF" required />
          </div>
        ) : (
          <div className="form-group" style={{ backgroundColor: '#fefce8', padding: '12px', borderRadius: '6px', border: '1px solid #fef08a' }}>
            <label style={{ color: '#a16207' }}>Possui dores ou problemas no corpo? (Joelho, Coluna, etc.):</label>
            <input type="text" value={restricoesCorpo} onChange={(e) => setRestricoesCorpo(e.target.value)} placeholder="Ex: Dor crônica no joelho esquerdo, hérnia de disco" required />
          </div>
        )}

        <button type="submit" className="btn-success" style={{ marginTop: '15px' }}>Finalizar Registro</button>
        
        <button type="button" style={{ marginTop: '10px', backgroundColor: '#64748b' }} onClick={() => navigate('/')}>
          Voltar para o Login
        </button>

        {sucesso && <p className="success-msg">{sucesso}</p>}
        {erro && <p className="error-msg">{erro}</p>}
      </form>
    </div>
  );
}