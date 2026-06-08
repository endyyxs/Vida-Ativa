import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function EditarItem() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { exercicio, rotina } = location.state || {};
  const isExercicio = !!exercicio;

  // Estados para Exercício
  const [nomeEx, setNomeEx] = useState(exercicio?.nome || '');
  const [descricaoEx, setDescricaoEx] = useState(exercicio?.descricao || '');
  const [dificuldadeEx, setDificuldadeEx] = useState(exercicio?.dificuldade || 'FACIL');
  const [contraindicacoesEx, setContraindicacoesEx] = useState(exercicio?.contraindicacoes || '');
  const [videoUrlEx, setVideoUrlEx] = useState(exercicio?.video_url || '');

  // Estados para Rotina
  const [nomeRot, setNomeRot] = useState(rotina?.nome || '');
  const [duracaoRot, setDuracaoRot] = useState(rotina?.duracao_total || '');
  const [perfilAlvoRot, setPerfilAlvoRot] = useState(rotina?.perfil_alvo || 'SEDENTARIO');
  
  // Estados para controle de Exercícios na Rotina
  const [todosExercicios, setTodosExercicios] = useState([]); 
  const [exerciciosSelecionados, setExerciciosSelecionados] = useState([]); 
  const [carregandoEx, setCarregandoEx] = useState(false);

  const [erro, setErro] = useState('');

  // 🔄 Carrega os dados atualizados em tempo real direto da API
  useEffect(() => {
    if (!isExercicio && rotina?.id) {
      setCarregandoEx(true);
      setErro('');
      
      Promise.all([
        api.get('/exercicios'),
        api.get(`/rotinas/${rotina.id}`)
      ])
      .then(([resTodos, resEspecifica]) => {
        setTodosExercicios(resTodos.data || []);
        
        // 💡 Sincroniza os inputs com o que está gravado de verdade no Neon
        const dadosBanco = resEspecifica.data;
        if (dadosBanco) {
          setNomeRot(dadosBanco.nome || '');
          setDuracaoRot(dadosBanco.duracao_total || '');
          setPerfilAlvoRot(dadosBanco.perfil_alvo || 'SEDENTARIO');
          
          const idsVinculados = dadosBanco.exercicios?.map(ex => ex.id) || [];
          setExerciciosSelecionados(idsVinculados);
        }
        setCarregandoEx(false);
      })
      .catch(err => {
        console.error("Erro ao carregar mapeamento de exercícios:", err);
        setErro("Não foi possível carregar a lista de exercícios atualizada.");
        setCarregandoEx(false);
      });
    }
  }, [isExercicio, rotina?.id]);

  const handleToggleExercicio = (id) => {
    if (exerciciosSelecionados.includes(id)) {
      setExerciciosSelecionados(exerciciosSelecionados.filter(exId => exId !== id));
    } else {
      setExerciciosSelecionados([...exerciciosSelecionados, id]);
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setErro('');
    
    try {
      if (isExercicio) {
        // 🚀 CORREÇÃO CRÍTICA: Variável mapeada corretamente para evitar travar antes do HTTP
        await api.put(`/exercicios/${exercicio.id}`, { 
          nome: nomeEx, 
          descricao: descricaoEx,
          dificuldade: dificuldadeEx, 
          contraindicacoes: contraindicacoesEx,
          video_url: videoUrlEx
        });
        alert("Exercício atualizado com sucesso! 🎉");
        navigate('/admin/exercicios');
      } else {
        if (exerciciosSelecionados.length === 0) {
          setErro("Uma rotina precisa ter pelo menos um exercício vinculado!");
          return;
        }

        await api.put(`/rotinas/${rotina.id}`, { 
          nome: nomeRot, 
          duracao_total: Number(duracaoRot),
          perfil_alvo: perfilAlvoRot,
          exerciciosIds: exerciciosSelecionados 
        });
        alert("Rotina atualizada com sucesso! 🎉");
        navigate('/admin/rotinas');
      }
    } catch (err) {
      console.error("Erro no salvamento:", err);
      const mensagemErro = err.response?.data?.error || "Erro desconhecido ao salvar no banco.";
      setErro(`Erro ao salvar alterações: ${mensagemErro}`);
    }
  };

  return (
    <div className="container">
      <h2>Editar {isExercicio ? "Exercício 🏋️‍♂️" : "Rotina ⏱️"}</h2>
      <form onSubmit={handleSalvar}>
        
        {isExercicio ? (
          <>
            <div className="form-group">
              <label>Nome do Exercício:</label>
              <input type="text" value={nomeEx} onChange={(e) => setNomeEx(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Instruções / Descrição:</label>
              <textarea value={descricaoEx} onChange={(e) => setDescricaoEx(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Dificuldade:</label>
              <select value={dificuldadeEx} onChange={(e) => setDificuldadeEx(e.target.value)}>
                <option value="FACIL">🟢 Fácil</option>
                <option value="MODERADO">🟡 Moderado</option>
                <option value="DIFICIL">🔴 Difícil</option>
              </select>
            </div>
            <div className="form-group">
              <label>Restrição/Contraindicação:</label>
              <input type="text" value={contraindicacoesEx} onChange={(e) => setContraindicacoesEx(e.target.value)} placeholder="Deixe em branco se for livre" />
            </div>
            <div className="form-group">
              <label>URL do Vídeo Demonstrativo:</label>
              <input type="url" value={videoUrlEx} onChange={(e) => setVideoUrlEx(e.target.value)} />
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label>Nome da Rotina:</label>
              <input type="text" value={nomeRot} onChange={(e) => setNomeRot(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Duração Total (minutos):</label>
              <input type="number" value={duracaoRot} onChange={(e) => setDuracaoRot(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Perfil Clínico Alvo:</label>
              <select value={perfilAlvoRot} onChange={(e) => setPerfilAlvoRot(e.target.value)}>
                <option value="SEDENTARIO">Sedentário</option>
                <option value="ATIVO_LEVE">Ativo Leve</option>
              </select>
            </div>

            <div className="form-group" style={{ marginTop: '20px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
                📋 Selecione os Exercícios desta Rotina:
              </label>
              
              {carregandoEx ? (
                <p style={{ fontStyle: 'italic', color: '#64748b' }}>Carregando lista de exercícios...</p>
              ) : (
                <div style={{ 
                  maxHeight: '200px', 
                  overflowY: 'auto', 
                  border: '1px solid #cbd5e1', 
                  borderRadius: '6px', 
                  padding: '10px',
                  backgroundColor: '#f8fafc'
                }}>
                  {todosExercicios.map(ex => (
                    <div key={ex.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', gap: '10px' }}>
                      <input 
                        type="checkbox" 
                        id={`ex-${ex.id}`}
                        checked={exerciciosSelecionados.includes(ex.id)}
                        onChange={() => handleToggleExercicio(ex.id)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <label htmlFor={`ex-${ex.id}`} style={{ cursor: 'pointer', fontSize: '15px', color: '#0f172a' }}>
                        {ex.nome} <span style={{ fontSize: '12px', color: '#64748b' }}>({ex.dificuldade})</span>
                      </label>
                    </div>
                  ))}
                  {todosExercicios.length === 0 && (
                    <p style={{ color: '#94a3b8', fontSize: '14px' }}>Nenhum exercício cadastrado no sistema.</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        <button type="submit" className="btn-success" style={{ width: '100%', marginTop: '20px' }}>
          Salvar Alterações
        </button>
        <button type="button" style={{ marginTop: '10px', backgroundColor: '#64748b', width: '100%' }} onClick={() => navigate(-1)}>
          Cancelar
        </button>
        {erro && <p className="error-msg" style={{ marginTop: '15px', color: '#dc2626', fontWeight: 'bold' }}>{erro}</p>}
      </form>
    </div>
  );
}