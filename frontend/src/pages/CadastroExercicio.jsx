import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function CadastroExercicio() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dificuldade, setDificuldade] = useState('FACIL');
  const [contraindicacoes, setContraindicacoes] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const navigate = useNavigate(); // Usaremos o navigate interno do React

  const handleSalvarExercicio = async (e) => {
    e.preventDefault();
    setErro(''); setSucesso('');

    try {
      await api.post('/exercicios', {
        nome,
        descricao,
        dificuldade,
        contraindicacoes,
        video_url: videoUrl
      });

      setSucesso('Exercício salvo com sucesso!');
      setTimeout(() => navigate('/admin/exercicios'), 1500);
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao salvar exercício.');
    }
  };

  return (
    <div className="container">
      <h2>Cadastrar Novo Exercício 🏋️‍♂️</h2>
      <form onSubmit={handleSalvarExercicio}>
        <div className="form-group">
          <label>Nome do Exercício:</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} id='nome' required />
        </div>

        <div className="form-group">
          <label>Descrição / Instruções:</label>
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} id='descricao'required />
        </div>

        <div className="form-group">
          <label>Dificuldade:</label>
          <select value={dificuldade} onChange={(e) => setDificuldade(e.target.value)} id='dificuldade'>
            <option value="FACIL">🟢 Fácil</option>
            <option value="MODERADO">🟡 Moderado</option>
            <option value="DIFICIL">🔴 Difícil</option>
          </select>
        </div>

        <div className="form-group">
          <label>Contraindicações / Restrições Clínicas (Opcional):</label>
          <input type="text" value={contraindicacoes} onChange={(e) => setContraindicacoes(e.target.value)} placeholder="Ex: joelho, coluna" />
        </div>

        <div className="form-group">
          <label>URL do Vídeo Demonstrativo (Opcional):</label>
          <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." />
        </div>

        <button type="submit" className="btn-success" id='btnSalvar'>Salvar Exercício</button>
        
        <button 
          type="button" 
          style={{ marginTop: '10px', backgroundColor: '#64748b' }} 
          onClick={() => navigate('/admin/exercicios')} // Sem recarregar a página
        >
          Voltar para Lista
        </button>

        {sucesso && <p className="success-msg">{sucesso}</p>}
        {erro && <p className="error-msg">{erro}</p>}
      </form>
    </div>
  );
}