# 📚 Documentação dos Serviços

Este projeto foi reorganizado com uma arquitetura de serviços para melhor manutenibilidade e escalabilidade.

## 🏗️ Estrutura dos Serviços

### 📁 Organização de Arquivos

```
src/
├── types/
│   └── api.ts              # Tipos TypeScript centralizados
├── config/
│   └── app.ts              # Configurações da aplicação
├── services/
│   ├── index.ts            # Exportações centralizadas
│   ├── authService.ts      # Serviço de autenticação
│   ├── agendamentoService.ts # Serviço de agendamentos
│   └── utilsService.ts     # Utilitários e funções auxiliares
└── app/
    └── utils/
        └── api.ts          # Cliente API refatorado
```

## 🔐 AuthService

Centraliza todas as operações de autenticação.

### Métodos Disponíveis

```typescript
import { AuthService } from '@/services';

// Login
const response = await AuthService.login({ username: 'user', password: 'pass' });

// Cadastro
await AuthService.iniciarCadastro({
  nome_completo: 'João Silva',
  username: 'joao@email.com',
  password: 'senha123',
  tel: '11999999999',
  email: 'joao@email.com'
});

// Verificar código
await AuthService.verificarCodigo('email@teste.com', '123456');

// Google OAuth
const config = await AuthService.getGoogleConfig();
const response = await AuthService.processGoogleCallback(code);

// Gerenciamento de token
AuthService.saveToken('token');
const token = AuthService.getToken();
AuthService.logout();

// Verificações
const isAuth = AuthService.isAuthenticated();
const requireAuth = AuthService.requireAuth(); // Redireciona se não autenticado
```

## 📅 AgendamentoService

Gerencia operações de agendamentos com validações.

### Métodos Disponíveis

```typescript
import { AgendamentoService } from '@/services';

// CRUD básico
const agendamento = await AgendamentoService.criar({
  nome: 'João Silva',
  telefone: '11999999999',
  servico: 'Corte + Barba',
  data: '2024-01-15',
  horario: '14:00'
});

const agendamentos = await AgendamentoService.listar();
await AgendamentoService.atualizar(id, { horario: '15:00' });
await AgendamentoService.remover(id);

// Busca específica
const porData = await AgendamentoService.buscarPorData('2024-01-15');
const porUsuario = await AgendamentoService.buscarPorUsuario('user123');
const porStatus = await AgendamentoService.buscarPorStatus('agendado');

// Validações
const { valid, errors } = AgendamentoService.validateAgendamento(data);
const disponivel = await AgendamentoService.verificarDisponibilidade('2024-01-15', '14:00');

// Formatação
const dataFormatada = AgendamentoService.formatarData('2024-01-15');
const statusColor = AgendamentoService.getStatusColor('agendado');
const statusText = AgendamentoService.getStatusText('agendado');
```

## 🛠️ UtilsService

Funções utilitárias para formatação, validação e outros helpers.

### Métodos Disponíveis

```typescript
import { UtilsService } from '@/services';

// WhatsApp
UtilsService.abrirWhatsApp(); // Mensagem padrão
UtilsService.abrirWhatsAppComMensagem('Mensagem customizada');

// Formatação
const telefoneFormatado = UtilsService.formatarTelefone('11999999999');
const telefoneNumeros = UtilsService.limparTelefone('(11) 99999-9999');
const cpfFormatado = UtilsService.formatarCPF('11144477735');
const nomeCapitalizado = UtilsService.capitalizarNome('joão silva');

// Validações
const telefoneValido = UtilsService.validarTelefone('11999999999');
const emailValido = UtilsService.validarEmail('teste@email.com');
const cpfValido = UtilsService.validarCPF('11144477735');

// Datas
const dataFormatada = UtilsService.formatarData(new Date());
const dataHoraFormatada = UtilsService.formatarDataHora(new Date());
const ehHoje = UtilsService.isHoje('2024-01-15');
const ehAmanha = UtilsService.isAmanha('2024-01-16');
const diasDiferenca = UtilsService.diferencaEmDias(date1, date2);

// Arrays
const semDuplicatas = UtilsService.removerDuplicatas(array);
const agrupados = UtilsService.agruparPor(array, 'propriedade');

// LocalStorage
const salvou = UtilsService.salvarNoStorage('chave', dados);
const dados = UtilsService.carregarDoStorage('chave');
const removeu = UtilsService.removerDoStorage('chave');

// Navegação
UtilsService.scrollParaElemento('elemento-id');
const copiou = await UtilsService.copiarTexto('texto para copiar');
```

## ⚙️ Configuração (APP_CONFIG)

Todas as configurações centralizadas em um local.

```typescript
import { APP_CONFIG } from '@/config/app';

// URLs da API
const baseURL = APP_CONFIG.api.baseURL;
const loginEndpoint = APP_CONFIG.api.endpoints.auth.login;

// WhatsApp
const whatsappNumber = APP_CONFIG.whatsapp.number;
const defaultMessage = APP_CONFIG.whatsapp.defaultMessage;

// Configurações de desenvolvimento
if (APP_CONFIG.dev.enableLogs) {
  console.log('Logs habilitados');
}

// Autenticação
const tokenKey = APP_CONFIG.auth.tokenKey;
const publicEndpoints = APP_CONFIG.auth.publicEndpoints;
```

## 🎯 Tipos TypeScript

Todos os tipos estão centralizados em `src/types/api.ts`:

```typescript
import type { 
  LoginCredentials,
  LoginResponse,
  CadastroData,
  AgendamentoData,
  Agendamento,
  ApiResponse,
  GoogleOAuthConfig,
  AdminData 
} from '@/types/api';
```

## 📦 Importação Centralizada

Use a importação centralizada para facilitar:

```typescript
// Importar tudo de uma vez
import { 
  AuthService, 
  AgendamentoService, 
  UtilsService,
  APP_CONFIG,
  type LoginCredentials,
  type Agendamento
} from '@/services';
```

## 🚀 Exemplos de Uso

### Exemplo 1: Login Completo

```typescript
import { AuthService } from '@/services';

const handleLogin = async (email: string, password: string) => {
  try {
    const response = await AuthService.login({ username: email, password });
    
    if (response.token) {
      // Token salvo automaticamente
      console.log('Login realizado com sucesso!');
      // Redirecionar usuário
    }
  } catch (error) {
    console.error('Erro no login:', error.message);
  }
};
```

### Exemplo 2: Agendamento com Validação

```typescript
import { AgendamentoService } from '@/services';

const criarAgendamento = async (dados) => {
  // Validar dados primeiro
  const { valid, errors } = AgendamentoService.validateAgendamento(dados);
  
  if (!valid) {
    alert(`Dados inválidos: ${errors.join(', ')}`);
    return;
  }

  // Verificar disponibilidade
  const disponivel = await AgendamentoService.verificarDisponibilidade(
    dados.data, 
    dados.horario
  );

  if (!disponivel) {
    alert('Horário não disponível');
    return;
  }

  // Criar agendamento
  try {
    const agendamento = await AgendamentoService.criar(dados);
    alert('Agendamento criado com sucesso!');
  } catch (error) {
    console.error('Erro:', error);
  }
};
```

### Exemplo 3: Formulário com Utilitários

```typescript
import { UtilsService } from '@/services';

const handleFormSubmit = (formData) => {
  // Validar email
  if (!UtilsService.validarEmail(formData.email)) {
    setError('Email inválido');
    return;
  }

  // Validar telefone
  if (!UtilsService.validarTelefone(formData.telefone)) {
    setError('Telefone inválido');
    return;
  }

  // Formatar dados
  const dadosFormatados = {
    ...formData,
    nome: UtilsService.capitalizarNome(formData.nome),
    telefone: UtilsService.limparTelefone(formData.telefone)
  };

  // Enviar dados...
};
```

## 🔧 Configuração de Desenvolvimento

### Logs de Debug

Os logs podem ser ativados/desativados via configuração:

```typescript
// Em desenvolvimento, logs estão habilitados automaticamente
// Em produção, logs são desabilitados automaticamente

// Para forçar logs:
const APP_CONFIG = {
  dev: {
    enableLogs: true
  }
};
```

### Variáveis de Ambiente

```env
NEXT_PUBLIC_API_URL=https://backbarbearialopez-r4bg.onrender.com
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
NODE_ENV=development
```

## ✅ Benefícios da Nova Arquitetura

1. **Manutenibilidade**: Código organizado e fácil de encontrar
2. **Escalabilidade**: Fácil adicionar novos recursos
3. **Type Safety**: Menos bugs com TypeScript completo
4. **Reutilização**: Serviços podem ser usados em qualquer lugar
5. **Debugging**: Logs centralizados e configuráveis
6. **Performance**: Funções otimizadas e cache quando necessário
7. **Testabilidade**: Estrutura facilita criação de testes
8. **Documentação**: Código auto-documentado com tipos

## 🚦 Próximos Passos Recomendados

1. **Migrar componentes restantes** para usar os novos serviços
2. **Implementar testes unitários** para cada serviço
3. **Adicionar sistema de cache** para otimizar performance
4. **Criar hooks customizados** para operações comuns
5. **Implementar sistema de notificações** centralizado
6. **Adicionar mais validações** específicas do negócio
7. **Configurar CI/CD** com testes automatizados
