# 🔄 Guia de Migração para os Novos Serviços

Este arquivo contém instruções para migrar os componentes restantes para usar os novos serviços.

## 📋 Checklist de Migração

### ✅ Já Migrados
- [x] `Header.tsx` - Atualizado com AuthService e UtilsService
- [x] `LoginModal.tsx` - Atualizado com AuthService
- [x] `CadastroModal.tsx` - Atualizado com AuthService
- [x] `AgendamentoModal.tsx` - Atualizado com AgendamentoService e UtilsService

### 🔄 Pendentes de Migração
- [ ] `AdminAgendamentosPanel.tsx`
- [ ] `PhoneModal.tsx`
- [ ] Páginas em `src/app/admin/`
- [ ] Páginas de autenticação
- [ ] Outras páginas que usam API

## 🛠️ Padrões de Migração

### 1. Substituir Importações

**Antes:**
```typescript
import { apiRequest, API_CONFIG } from "@/app/utils/api";
```

**Depois:**
```typescript
import { AuthService, AgendamentoService, UtilsService } from "@/services";
// ou importações específicas:
import { AuthService } from "@/services";
```

### 2. Substituir Chamadas de API

#### Autenticação

**Antes:**
```typescript
const response = await apiRequest(API_CONFIG.endpoints.auth.login, {
  method: 'POST',
  body: JSON.stringify(credentials),
});
```

**Depois:**
```typescript
const response = await AuthService.login(credentials);
```

#### Agendamentos

**Antes:**
```typescript
const response = await apiRequest(API_CONFIG.endpoints.agendamentos.criar, {
  method: 'POST',
  body: JSON.stringify(data)
});
```

**Depois:**
```typescript
const response = await AgendamentoService.criar(data);
```

#### Google OAuth

**Antes:**
```typescript
const googleConfig = await apiRequest(API_CONFIG.endpoints.auth.googleConfig, {
  method: 'GET',
});
```

**Depois:**
```typescript
const googleConfig = await AuthService.getGoogleConfig();
```

### 3. Substituir Validações e Formatações

**Antes:**
```typescript
// Validação manual de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValid = emailRegex.test(email);

// Formatação manual de telefone
const formatPhone = (phone) => {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};
```

**Depois:**
```typescript
// Usar UtilsService
const isValid = UtilsService.validarEmail(email);
const formatted = UtilsService.formatarTelefone(phone);
```

### 4. Substituir WhatsApp

**Antes:**
```typescript
const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
window.open(whatsappUrl, '_blank');
```

**Depois:**
```typescript
UtilsService.abrirWhatsAppComMensagem(message);
// ou para mensagem padrão:
UtilsService.abrirWhatsApp();
```

### 5. Substituir Gerenciamento de Token

**Antes:**
```typescript
localStorage.setItem('token', token);
const token = localStorage.getItem('token');
localStorage.removeItem('token');
```

**Depois:**
```typescript
AuthService.saveToken(token);
const token = AuthService.getToken();
AuthService.logout();
```

## 📝 Instruções Específicas por Componente

### AdminAgendamentosPanel.tsx

1. **Importar serviços:**
```typescript
import { AgendamentoService, UtilsService } from "@/services";
```

2. **Substituir listagem:**
```typescript
// Antes
const response = await apiRequest('/api/agendamentos');

// Depois
const agendamentos = await AgendamentoService.listar();
```

3. **Substituir atualização:**
```typescript
// Antes
await apiRequest(`/api/agendar/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data)
});

// Depois
await AgendamentoService.atualizar(id, data);
```

4. **Substituir remoção:**
```typescript
// Antes
await apiRequest(`/api/agendar/${id}`, {
  method: 'DELETE'
});

// Depois
await AgendamentoService.remover(id);
```

5. **Adicionar formatações:**
```typescript
// Para datas
AgendamentoService.formatarData(agendamento.data)

// Para status
<span className={AgendamentoService.getStatusColor(agendamento.status)}>
  {AgendamentoService.getStatusText(agendamento.status)}
</span>

// Para telefones
UtilsService.formatarTelefone(agendamento.telefone)
```

### PhoneModal.tsx

1. **Importar serviços:**
```typescript
import { AuthService, UtilsService } from "@/services";
```

2. **Substituir validação de telefone:**
```typescript
// Antes
const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
const isValid = phoneRegex.test(phone);

// Depois
const isValid = UtilsService.validarTelefone(phone);
```

3. **Substituir formatação:**
```typescript
// Antes
const formatted = phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');

// Depois
const formatted = UtilsService.formatarTelefone(phone);
```

4. **Substituir API de atualização:**
```typescript
// Antes
await apiRequest(API_CONFIG.endpoints.auth.atualizarTelefone, {
  method: 'POST',
  body: JSON.stringify({ telefone })
});

// Depois
await AuthService.atualizarTelefone(telefone);
```

### Páginas Admin

1. **Verificar autenticação:**
```typescript
// No início do componente
useEffect(() => {
  AuthService.requireAuth(); // Redireciona se não autenticado
}, []);
```

2. **Substituir criação de admin:**
```typescript
// Antes
await apiRequest(API_CONFIG.endpoints.admin.criarAdmin, {
  method: 'POST',
  body: JSON.stringify(adminData)
});

// Depois
await AuthService.criarAdmin(adminData); // ou criar um AdminService específico
```

## 🔧 Comandos para Migração

### 1. Encontrar arquivos que precisam de migração:
```bash
grep -r "API_CONFIG" src/ --include="*.tsx" --include="*.ts"
grep -r "apiRequest" src/ --include="*.tsx" --include="*.ts"
```

### 2. Verificar imports antigos:
```bash
grep -r "from.*@/app/utils/api" src/
```

### 3. Verificar uso de WhatsApp manual:
```bash
grep -r "wa.me" src/
grep -r "window.open.*whatsapp" src/
```

## ⚠️ Cuidados Durante a Migração

1. **Teste cada componente** após a migração
2. **Verifique se os tipos** estão corretos
3. **Mantenha a funcionalidade** exatamente igual
4. **Use validações dos serviços** quando disponíveis
5. **Remova código duplicado** de validação/formatação
6. **Atualize imports** para usar os novos serviços

## 🧪 Como Testar Após Migração

1. **Build do projeto:**
```bash
npm run build
```

2. **Lint do código:**
```bash
npm run lint
```

3. **Teste manual:**
   - Login/logout
   - Cadastro
   - Agendamentos
   - WhatsApp
   - Admin

4. **Verificar console** para erros

## 📚 Recursos Úteis

- **Documentação dos Serviços:** `SERVICOS_DOCUMENTACAO.md`
- **Exemplo de Uso:** `src/app/components/ExemploServicos.tsx`
- **Tipos TypeScript:** `src/types/api.ts`
- **Configurações:** `src/config/app.ts`

## 🎯 Resultado Esperado

Após a migração completa, o projeto terá:

✅ **Código mais limpo** e organizado  
✅ **Menos duplicação** de código  
✅ **Melhor manutenibilidade**  
✅ **Type safety** completo  
✅ **Logs organizados**  
✅ **Validações centralizadas**  
✅ **Configuração unificada**  

## 💡 Dicas Extras

1. **Faça migração gradual** - um componente por vez
2. **Mantenha backup** dos arquivos originais
3. **Teste imediatamente** após cada migração
4. **Use o componente ExemploServicos** como referência
5. **Consulte a documentação** quando em dúvida
