/**
 * Exportações centralizadas dos serviços
 * Facilita importação e mantém organização
 */

// Serviços principais
export { AuthService } from './authService';
export { AgendamentoService } from './agendamentoService';
export { UtilsService } from './utilsService';

// Re-export das funções da API para compatibilidade
export * from '@/app/utils/api';

// Re-export dos tipos
export * from '@/types/api';

// Re-export da configuração
export { APP_CONFIG } from '@/config/app';
