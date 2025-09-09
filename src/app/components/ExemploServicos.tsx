/**
 * Exemplo de uso dos novos serviços
 * Este arquivo demonstra como usar os serviços organizados
 */

"use client";
import { useState, useEffect } from 'react';
import { 
  AuthService, 
  AgendamentoService, 
  UtilsService,
  type Agendamento,
  type LoginCredentials,
  type AgendamentoData 
} from '@/services';

export default function ExemploServicos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar autenticação ao carregar
    setIsAuthenticated(AuthService.isAuthenticated());
    
    if (AuthService.isAuthenticated()) {
      carregarAgendamentos();
    }
  }, []);

  const carregarAgendamentos = async () => {
    try {
      setLoading(true);
      const dados = await AgendamentoService.listar();
      setAgendamentos(dados);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fazerLogin = async () => {
    try {
      const credentials: LoginCredentials = {
        username: 'usuario@email.com',
        password: 'senha123'
      };
      
      await AuthService.login(credentials);
      setIsAuthenticated(true);
      
      // Carregar dados após login
      carregarAgendamentos();
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  const criarAgendamento = async () => {
    try {
      const novoAgendamento: AgendamentoData = {
        nome: 'João Silva',
        telefone: '(11) 99999-9999',
        servico: 'Corte + Barba',
        data: '2024-01-15',
        horario: '14:00'
      };

      // Validar antes de enviar
      const { valid, errors } = AgendamentoService.validateAgendamento(novoAgendamento);
      
      if (!valid) {
        alert(`Dados inválidos: ${errors.join(', ')}`);
        return;
      }

      const agendamento = await AgendamentoService.criar(novoAgendamento);
      
      // Atualizar lista
      setAgendamentos(prev => [...prev, agendamento]);
      
      alert('Agendamento criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
    }
  };

  const abrirWhatsApp = () => {
    UtilsService.abrirWhatsApp();
  };

  const formatarTelefone = (telefone: string) => {
    return UtilsService.formatarTelefone(telefone);
  };

  const validarEmail = (email: string) => {
    const isValid = UtilsService.validarEmail(email);
    alert(`Email "${email}" é ${isValid ? 'válido' : 'inválido'}`);
  };

  const fazerLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setAgendamentos([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Exemplo dos Novos Serviços</h1>
      
      {/* Status de Autenticação */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Status de Autenticação</h2>
        <p>Status: {isAuthenticated ? '✅ Logado' : '❌ Não logado'}</p>
        
        <div className="mt-2 space-x-2">
          {!isAuthenticated ? (
            <button 
              onClick={fazerLogin}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Fazer Login
            </button>
          ) : (
            <button 
              onClick={fazerLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Agendamentos */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Agendamentos</h2>
        
        {isAuthenticated && (
          <div className="mb-4">
            <button 
              onClick={criarAgendamento}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Criar Agendamento de Teste
            </button>
            
            <button 
              onClick={carregarAgendamentos}
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Atualizar Lista'}
            </button>
          </div>
        )}

        {agendamentos.length > 0 ? (
          <div className="space-y-2">
            {agendamentos.map((agendamento, index) => (
              <div key={agendamento.id || index} className="p-3 bg-white rounded border">
                <p><strong>Nome:</strong> {agendamento.nome}</p>
                <p><strong>Serviço:</strong> {agendamento.servico}</p>
                <p><strong>Data:</strong> {AgendamentoService.formatarData(agendamento.data)}</p>
                <p><strong>Horário:</strong> {AgendamentoService.formatarHorario(agendamento.horario)}</p>
                <p><strong>Telefone:</strong> {formatarTelefone(agendamento.telefone)}</p>
                {agendamento.status && (
                  <p>
                    <strong>Status:</strong> 
                    <span className={AgendamentoService.getStatusColor(agendamento.status)}>
                      {AgendamentoService.getStatusText(agendamento.status)}
                    </span>
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhum agendamento encontrado.</p>
        )}
      </div>

      {/* Utilitários */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Utilitários</h2>
        
        <div className="space-x-2 mb-4">
          <button 
            onClick={abrirWhatsApp}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Abrir WhatsApp
          </button>
          
          <button 
            onClick={() => validarEmail('teste@email.com')}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Validar Email
          </button>
          
          <button 
            onClick={() => validarEmail('email-invalido')}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Testar Email Inválido
          </button>
        </div>

        <div className="space-y-2">
          <p><strong>Telefone formatado:</strong> {formatarTelefone('11999999999')}</p>
          <p><strong>Data formatada:</strong> {UtilsService.formatarData(new Date())}</p>
          <p><strong>CPF válido:</strong> {UtilsService.validarCPF('11144477735') ? 'Sim' : 'Não'}</p>
          <p><strong>Nome capitalizado:</strong> {UtilsService.capitalizarNome('joão silva')}</p>
        </div>
      </div>

      {/* Informações dos Serviços */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Sobre os Novos Serviços</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>AuthService:</strong> Gerencia autenticação, login, cadastro e tokens</li>
          <li><strong>AgendamentoService:</strong> CRUD completo de agendamentos com validações</li>
          <li><strong>UtilsService:</strong> Funções utilitárias para formatação e validação</li>
          <li><strong>Configuração centralizada:</strong> Todas as URLs e configurações em um local</li>
          <li><strong>TypeScript completo:</strong> Tipos seguros para todas as operações</li>
          <li><strong>Logs configuráveis:</strong> Sistema de debug que pode ser ativado/desativado</li>
        </ul>
      </div>
    </div>
  );
}
