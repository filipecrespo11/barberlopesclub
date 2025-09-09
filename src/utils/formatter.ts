/**
 * SISTEMA DE FORMATAÇÃO CENTRALIZADO
 * ===================================
 * 
 * Sistema completo de formatação de dados para padronização visual.
 * Implementa formatações específicas para o contexto brasileiro.
 * 
 * FUNCIONALIDADES:
 * - Formatação de documentos: CPF, telefone, CEP
 * - Formatação de valores: moeda brasileira
 * - Formatação de datas: data, datetime, time
 * - Formatação de texto: nomes próprios, slugs, truncate
 * - Formatações específicas: WhatsApp, status, serviços
 * - Utilitários: busca, números apenas
 * 
 * PADRÕES UTILIZADOS:
 * - Intl API para formatação internacionalizada
 * - Regex para limpeza e formatação
 * - Normalização Unicode para remoção de acentos
 * - Padrões brasileiros (pt-BR)
 * 
 * USO:
 * - import { Formatter } from '@/utils/formatter';
 * - const formatted = Formatter.phone('11999999999');
 * - const price = Formatter.currency(19.99);
 * 
 * MANUTENÇÃO:
 * - Para novos formatos: adicionar métodos estáticos
 * - Para alterar padrões: modificar regex ou Intl configs
 * - Para novos status/serviços: atualizar mapeamentos
 * - Para localizações: alterar 'pt-BR' para outros locales
 * 
 * @author Sistema de Manutenção - Lopes Club
 * @version 2.0
 * @lastModified 2025-09-09
 */

/**
 * CLASSE PRINCIPAL DE FORMATAÇÃO
 * ===============================
 * Todos os métodos são estáticos para facilitar uso direto
 */
export class Formatter {
  
  // ==========================================
  // FORMATAÇÕES DE DOCUMENTOS BRASILEIROS
  // ==========================================
  
  /**
   * FORMATAÇÃO DE TELEFONE BRASILEIRO
   * =================================
   * Formatos aceitos: (11) 99999-9999 ou (11) 9999-9999
   * Remove caracteres não numéricos e aplica máscara
   * 
   * EXEMPLOS:
   * - "11999999999" → "(11) 99999-9999"
   * - "1133334444" → "(11) 3333-4444"
   * 
   * @param value - Número de telefone sem formatação
   * @returns string - Telefone formatado
   */
  static phone(value: string): string {
    const numbers = value.replace(/\D/g, ''); // Remove tudo que não é número
    
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
    
    // Trunca se tiver mais de 11 dígitos
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }

  /**
   * FORMATAÇÃO DE CPF
   * =================
   * Formato padrão: 000.000.000-00
   * Remove caracteres não numéricos e aplica máscara
   * 
   * EXEMPLO:
   * - "12345678901" → "123.456.789-01"
   * 
   * @param value - CPF sem formatação
   * @returns string - CPF formatado
   */
  static cpf(value: string): string {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    
    // Formato completo
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  }

  /**
   * FORMATAÇÃO DE CEP
   * =================
   * Formato padrão: 00000-000
   * Remove caracteres não numéricos e aplica máscara
   * 
   * EXEMPLO:
   * - "01234567" → "01234-567"
   * 
   * @param value - CEP sem formatação
   * @returns string - CEP formatado
   */
  static cep(value: string): string {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  }

  // ==========================================
  // FORMATAÇÕES DE VALORES E DATAS
  // ==========================================

  /**
   * FORMATAÇÃO DE MOEDA BRASILEIRA
   * ===============================
   * Usa Intl.NumberFormat para formatação padrão BRL
   * 
   * EXEMPLO:
   * - 19.99 → "R$ 19,99"
   * - 1000 → "R$ 1.000,00"
   * 
   * @param value - Valor numérico
   * @returns string - Valor formatado em reais
   */
  static currency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  /**
   * FORMATAÇÃO DE DATA
   * ==================
   * Formato brasileiro: dd/mm/yyyy
   * Aceita Date object ou string ISO
   * 
   * EXEMPLO:
   * - new Date('2025-09-09') → "09/09/2025"
   * 
   * @param date - Data como Date ou string
   * @returns string - Data formatada
   */
  static date(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(d);
  }

  /**
   * FORMATAÇÃO DE DATA E HORA
   * =========================
   * Formato brasileiro: dd/mm/yyyy hh:mm
   * Aceita Date object ou string ISO
   * 
   * EXEMPLO:
   * - new Date('2025-09-09T15:30') → "09/09/2025 15:30"
   * 
   * @param date - Data como Date ou string
   * @returns string - Data e hora formatadas
   */
  static datetime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  }

  /**
   * FORMATAÇÃO DE HORÁRIO
   * =====================
   * Garante formato hh:mm com zeros à esquerda
   * 
   * EXEMPLO:
   * - "9:5" → "09:05"
   * 
   * @param time - Horário em formato h:m ou hh:mm
   * @returns string - Horário formatado
   */
  static time(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }

  // ==========================================
  // FORMATAÇÕES DE TEXTO
  // ==========================================

  /**
   * FORMATAÇÃO DE NOME PRÓPRIO
   * ===========================
   * Primeira letra de cada palavra em maiúscula
   * Útil para padronizar nomes de usuários
   * 
   * EXEMPLO:
   * - "joão silva santos" → "João Silva Santos"
   * 
   * @param name - Nome a ser formatado
   * @returns string - Nome formatado
   */
  static properName(name: string): string {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * FORMATAÇÃO PARA URL AMIGÁVEL (SLUG)
   * ===================================
   * Converte texto em formato URL-friendly
   * Remove acentos, caracteres especiais e espaços
   * 
   * EXEMPLO:
   * - "Corte de Cabelo Masculino" → "corte-de-cabelo-masculino"
   * 
   * @param text - Texto a ser convertido
   * @returns string - Slug formatado
   */
  static slug(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')                    // Decomposição de caracteres Unicode
      .replace(/[\u0300-\u036f]/g, '')     // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '')        // Remove caracteres especiais
      .trim()
      .replace(/\s+/g, '-');               // Substitui espaços por hífens
  }

  /**
   * TRUNCAR TEXTO COM RETICÊNCIAS
   * ==============================
   * Corta texto mantendo legibilidade
   * Adiciona "..." quando necessário
   * 
   * EXEMPLO:
   * - truncate("Texto muito longo", 10) → "Texto m..."
   * 
   * @param text - Texto a ser truncado
   * @param maxLength - Tamanho máximo
   * @returns string - Texto truncado
   */
  static truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
  }

  // ==========================================
  // FORMATAÇÕES ESPECÍFICAS DO SISTEMA
  // ==========================================

  /**
   * FORMATAÇÃO DE TELEFONE PARA WHATSAPP
   * ====================================
   * Prepara número para integração com WhatsApp API
   * Adiciona código do país (55) e trata números antigos
   * 
   * LÓGICA:
   * - Adiciona 55 (Brasil) no início
   * - Mantém 9º dígito para celulares atuais
   * - Compatível com números antigos de SP/RJ
   * 
   * EXEMPLO:
   * - "11999999999" → "5511999999999"
   * 
   * @param phone - Número de telefone
   * @returns string - Número formatado para WhatsApp
   */
  static whatsappPhone(phone: string): string {
    const numbers = phone.replace(/\D/g, '');
    
    // Lista de DDDs que precisam de tratamento especial (SP/RJ principalmente)
    const specialCodes = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24'];
    
    // Verifica se é celular antigo que precisa do 9
    if (numbers.length === 11 && specialCodes.includes(numbers.slice(0, 2))) {
      if (numbers.charAt(2) === '9') {
        return '55' + numbers; // Já tem o 9, mantém
      }
    }
    
    return '55' + numbers; // Adiciona código do país
  }

  /**
   * FORMATAÇÃO DE STATUS DE AGENDAMENTO
   * ===================================
   * Retorna formatação visual para status de agendamentos
   * Inclui texto, cor e emoji para melhor UX
   * 
   * @param status - Status do agendamento
   * @returns object - Texto, cor e ícone formatados
   */
  static agendamentoStatus(status: string): { text: string; color: string; icon: string } {
    const statusMap = {
      'pendente':   { text: 'Pendente',   color: 'yellow', icon: '⏳' },
      'confirmado': { text: 'Confirmado', color: 'green',  icon: '✅' },
      'cancelado':  { text: 'Cancelado',  color: 'red',    icon: '❌' },
      'concluido':  { text: 'Concluído', color: 'blue',   icon: '🏁' },
      'reagendado': { text: 'Reagendado', color: 'orange', icon: '📅' }
    };
    
    return statusMap[status as keyof typeof statusMap] || 
           { text: status, color: 'gray', icon: '❓' };
  }

  /**
   * FORMATAÇÃO DE TIPO DE SERVIÇO
   * ==============================
   * Retorna formatação visual para tipos de serviços
   * Inclui texto descritivo e emoji identificador
   * 
   * @param servico - Tipo de serviço
   * @returns object - Texto e ícone formatados
   */
  static servicoType(servico: string): { text: string; icon: string } {
    const servicoMap = {
      'corte':        { text: 'Corte de Cabelo',    icon: '✂️' },
      'barba':        { text: 'Barba',              icon: '🪒' },
      'corte-barba':  { text: 'Corte + Barba',     icon: '💇‍♂️' },
      'sobrancelha':  { text: 'Sobrancelha',       icon: '👁️' },
      'outros':       { text: 'Outros Serviços',   icon: '🛠️' }
    };
    
    return servicoMap[servico as keyof typeof servicoMap] || 
           { text: servico, icon: '❓' };
  }

  // ==========================================
  // UTILITÁRIOS DE FORMATAÇÃO
  // ==========================================

  /**
   * LIMPAR FORMATAÇÃO (APENAS NÚMEROS)
   * ===================================
   * Remove todos os caracteres não numéricos
   * Útil para preparar dados para APIs
   * 
   * EXEMPLO:
   * - "(11) 99999-9999" → "11999999999"
   * 
   * @param value - Texto com formatação
   * @returns string - Apenas números
   */
  static numbersOnly(value: string): string {
    return value.replace(/\D/g, '');
  }

  /**
   * FORMATAÇÃO DE TEXTO PARA BUSCA
   * ===============================
   * Padroniza texto para facilitar buscas
   * Remove acentos, espaços extras e normaliza case
   * 
   * UTILIDADE:
   * - Comparação de strings ignoring case/accents
   * - Busca fuzzy em listas
   * - Indexação de texto
   * 
   * EXEMPLO:
   * - "João da Silva" → "joao da silva"
   * 
   * @param text - Texto a ser normalizado
   * @returns string - Texto normalizado para busca
   */
  static searchText(text: string): string {
    return text
      .toLowerCase()                       // Converte para minúsculas
      .normalize('NFD')                    // Decomposição Unicode
      .replace(/[\u0300-\u036f]/g, '')     // Remove acentos
      .replace(/\s+/g, ' ')                // Normaliza espaços
      .trim();                             // Remove espaços das bordas
  }

  // ==========================================
  // FUTURAS FORMATAÇÕES
  // ==========================================
  // Adicionar conforme necessário:
  // - static cnpj(value: string): string
  // - static rg(value: string): string  
  // - static percentage(value: number): string
  // - static fileSize(bytes: number): string
  // - static duration(seconds: number): string
}
