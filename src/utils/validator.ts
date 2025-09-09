/**
 * SISTEMA DE VALIDAÇÃO CENTRALIZADO
 * ==================================
 * 
 * Sistema completo de validações para formulários e dados.
 * Implementa regras de negócio padronizadas e reutilizáveis.
 * 
 * FUNCIONALIDADES:
 * - Validações básicas: required, email, phone, cpf, password
 * - Validações compostas: loginForm, cadastroForm, agendamentoForm
 * - Validações customizadas: sistema de regras flexível
 * - Suporte a warnings além de erros
 * - Mensagens padronizadas e consistentes
 * 
 * TIPOS DE RETORNO:
 * - isValid: boolean - Se passou na validação
 * - errors: string[] - Lista de erros críticos
 * - warnings?: string[] - Lista de avisos não bloqueantes
 * 
 * USO:
 * - import { Validator } from '@/utils/validator';
 * - const result = Validator.email('test@email.com');
 * - if (result.isValid) { // prosseguir }
 * 
 * MANUTENÇÃO:
 * - Para novas validações: adicionar métodos estáticos
 * - Para alterar regras: modificar regex ou lógica específica
 * - Para mensagens: alterar strings de retorno
 * - Para validações compostas: criar novos métodos *Form
 * 
 * @author Sistema de Manutenção - Lopes Club
 * @version 2.0
 * @lastModified 2025-09-09
 */

/**
 * INTERFACE DO RESULTADO DE VALIDAÇÃO
 * ====================================
 * Estrutura padrão para todos os retornos de validação
 */
export interface ValidationResult {
  isValid: boolean;      // Se passou na validação
  errors: string[];      // Erros que impedem prosseguir
  warnings?: string[];   // Avisos que não bloqueiam
}

/**
 * INTERFACE PARA REGRAS CUSTOMIZADAS
 * ==================================
 * Permite criar validações específicas e reutilizáveis
 */
export interface ValidationRule<T = any> {
  name: string;          // Nome identificador da regra
  validate: (value: T) => boolean;  // Função de validação
  message: string;       // Mensagem de erro
}

/**
 * CLASSE PRINCIPAL DE VALIDAÇÃO
 * ==============================
 * Todos os métodos são estáticos para facilitar uso direto
 */
class Validator {
  
  // ==========================================
  // VALIDAÇÕES BÁSICAS
  // ==========================================
  
  /**
   * VALIDAÇÃO DE CAMPO OBRIGATÓRIO
   * ===============================
   * Verifica se valor não é null, undefined ou string vazia
   * @param value - Valor a ser validado
   * @returns ValidationResult - Resultado da validação
   */
  static required = <T>(value: T): ValidationResult => ({
    isValid: value !== null && value !== undefined && value !== '',
    errors: value !== null && value !== undefined && value !== '' ? [] : ['Este campo é obrigatório']
  });

  /**
   * VALIDAÇÃO DE EMAIL
   * ==================
   * Usa regex padrão para validar formato de email
   * REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
   * @param email - Email a ser validado
   * @returns ValidationResult - Resultado da validação
   */
  static email(email: string): ValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    return {
      isValid,
      errors: isValid ? [] : ['Email deve ter um formato válido']
    };
  }

  /**
   * VALIDAÇÃO DE TELEFONE
   * =====================
   * Remove formatação e valida quantidade de dígitos
   * ACEITA: 10 dígitos (fixo) ou 11 dígitos (celular)
   * @param phone - Telefone a ser validado
   * @returns ValidationResult - Resultado da validação
   */
  static phone(phone: string): ValidationResult {
    // Remove formatação para validar apenas números
    const numbers = phone.replace(/\D/g, '');
    const isValid = numbers.length >= 10 && numbers.length <= 11;
    
    return {
      isValid,
      errors: isValid ? [] : ['Telefone deve ter 10 ou 11 dígitos']
    };
  }

  /**
   * VALIDAÇÃO DE CPF
   * ================
   * Implementa algoritmo completo de validação de CPF
   * Verifica: quantidade de dígitos, sequências iguais, dígitos verificadores
   * @param cpf - CPF a ser validado (com ou sem formatação)
   * @returns ValidationResult - Resultado da validação
   */
  static cpf(cpf: string): ValidationResult {
    const numbers = cpf.replace(/\D/g, '');
    
    // ==========================================
    // VERIFICAÇÕES BÁSICAS
    // ==========================================
    if (numbers.length !== 11) {
      return { isValid: false, errors: ['CPF deve ter 11 dígitos'] };
    }
    
    // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(numbers)) {
      return { isValid: false, errors: ['CPF inválido'] };
    }
    
    // ==========================================
    // VALIDAÇÃO DO PRIMEIRO DÍGITO VERIFICADOR
    // ==========================================
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers.charAt(i)) * (10 - i);
    }
    let digit1 = (sum * 10) % 11;
    if (digit1 === 10) digit1 = 0;
    
    if (digit1 !== parseInt(numbers.charAt(9))) {
      return { isValid: false, errors: ['CPF inválido'] };
    }
    
    // ==========================================
    // VALIDAÇÃO DO SEGUNDO DÍGITO VERIFICADOR
    // ==========================================
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers.charAt(i)) * (11 - i);
    }
    let digit2 = (sum * 10) % 11;
    if (digit2 === 10) digit2 = 0;
    
    if (digit2 !== parseInt(numbers.charAt(10))) {
      return { isValid: false, errors: ['CPF inválido'] };
    }
    
    return { isValid: true, errors: [] };
  }

  /**
   * VALIDAÇÃO DE SENHA
   * ==================
   * Valida senhas com critérios de segurança
   * CRITÉRIOS OBRIGATÓRIOS: mínimo 6 caracteres
   * RECOMENDAÇÕES (warnings): 8+ chars, maiúsculas, minúsculas, números
   * @param password - Senha a ser validada
   * @returns ValidationResult - Resultado com errors e warnings
   */
  static password(password: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // ==========================================
    // CRITÉRIOS OBRIGATÓRIOS (ERRORS)
    // ==========================================
    if (password.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }
    
    // ==========================================
    // RECOMENDAÇÕES DE SEGURANÇA (WARNINGS)
    // ==========================================
    if (password.length < 8) {
      warnings.push('Recomendamos senhas com pelo menos 8 caracteres');
    }
    
    if (!/[a-z]/.test(password)) {
      warnings.push('Recomendamos incluir letras minúsculas');
    }
    
    if (!/[A-Z]/.test(password)) {
      warnings.push('Recomendamos incluir letras maiúsculas');
    }
    
    if (!/[0-9]/.test(password)) {
      warnings.push('Recomendamos incluir números');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // ==========================================
  // VALIDAÇÕES COMPOSTAS (FORMULÁRIOS)
  // ==========================================
  
  /**
   * VALIDAÇÃO DE FORMULÁRIO DE LOGIN
   * =================================
   * Valida campos necessários para login: email + password
   * @param data - Dados do formulário de login
   * @returns ValidationResult - Resultado consolidado
   */
  static loginForm(data: { email: string; password: string }): ValidationResult {
    const results = [
      this.required(data.email),    // Email obrigatório
      this.email(data.email),       // Email válido
      this.required(data.password)  // Senha obrigatória
    ];
    
    // Consolida todos os erros
    const allErrors = results.flatMap(r => r.errors);
    
    return {
      isValid: allErrors.length === 0,
      errors: allErrors
    };
  }

  /**
   * VALIDAÇÃO DE FORMULÁRIO DE CADASTRO
   * ====================================
   * Valida todos os campos necessários para criação de conta
   * @param data - Dados do formulário de cadastro
   * @returns ValidationResult - Resultado consolidado com warnings
   */
  static cadastroForm(data: {
    nome_completo: string;
    email: string;
    password: string;
    tel: string;
  }): ValidationResult {
    const results = [
      this.required(data.nome_completo), // Nome obrigatório
      this.required(data.email),         // Email obrigatório
      this.email(data.email),            // Email válido
      this.required(data.password),      // Senha obrigatória
      this.password(data.password),      // Senha válida (com warnings)
      this.required(data.tel),           // Telefone obrigatório
      this.phone(data.tel)               // Telefone válido
    ];
    
    // Consolida erros e warnings
    const allErrors = results.flatMap(r => r.errors);
    const allWarnings = results.flatMap(r => r.warnings || []);
    
    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings
    };
  }

  /**
   * VALIDAÇÃO DE FORMULÁRIO DE AGENDAMENTO
   * ======================================
   * Valida todos os campos necessários para criar agendamento
   * Inclui validação de data (não pode ser no passado)
   * @param data - Dados do formulário de agendamento
   * @returns ValidationResult - Resultado da validação
   */
  static agendamentoForm(data: {
    nome: string;
    telefone: string;
    servico: string;
    data: string;
    horario: string;
  }): ValidationResult {
    const errors: string[] = [];
    
    // ==========================================
    // VALIDAÇÕES OBRIGATÓRIAS
    // ==========================================
    if (!data.nome.trim()) errors.push('Nome é obrigatório');
    if (!data.telefone.trim()) errors.push('Telefone é obrigatório');
    if (!data.servico) errors.push('Serviço é obrigatório');
    if (!data.data) errors.push('Data é obrigatória');
    if (!data.horario) errors.push('Horário é obrigatório');
    
    // ==========================================
    // VALIDAÇÕES ESPECÍFICAS
    // ==========================================
    
    // Validação de telefone se preenchido
    if (data.telefone) {
      const phoneResult = this.phone(data.telefone);
      if (!phoneResult.isValid) {
        errors.push(...phoneResult.errors);
      }
    }
    
    // ==========================================
    // VALIDAÇÃO DE DATA
    // ==========================================
    if (data.data) {
      const selectedDate = new Date(data.data);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Remove horas para comparar apenas datas
      
      if (selectedDate < today) {
        errors.push('Data não pode ser no passado');
      }
      
      // Opcional: validar se data não é muito no futuro
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 6); // 6 meses no futuro
      
      if (selectedDate > maxDate) {
        errors.push('Data não pode ser mais de 6 meses no futuro');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // ==========================================
  // SISTEMA DE VALIDAÇÃO CUSTOMIZADA
  // ==========================================
  
  /**
   * VALIDAÇÃO CUSTOMIZADA COM REGRAS
   * =================================
   * Permite criar validações específicas usando regras definidas
   * Útil para casos especiais ou regras de negócio específicas
   * 
   * EXEMPLO DE USO:
   * const rules = [
   *   { name: 'minLength', validate: (v) => v.length >= 5, message: 'Mínimo 5 chars' }
   * ];
   * const result = Validator.custom('teste', rules);
   * 
   * @param value - Valor a ser validado
   * @param rules - Array de regras a serem aplicadas
   * @returns ValidationResult - Resultado da validação
   */
  static custom<T>(
    value: T, 
    rules: ValidationRule<T>[]
  ): ValidationResult {
    const errors: string[] = [];
    
    // Executa cada regra
    for (const rule of rules) {
      if (!rule.validate(value)) {
        errors.push(rule.message);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // ==========================================
  // FUTURAS VALIDAÇÕES
  // ==========================================
  // Adicionar conforme necessário:
  // - static cnpj(cnpj: string): ValidationResult
  // - static cep(cep: string): ValidationResult  
  // - static creditCard(card: string): ValidationResult
  // - static url(url: string): ValidationResult
  // - static dateRange(start: string, end: string): ValidationResult
}

/**
 * EXPORT DA CLASSE
 * =================
 * Exporta classe para uso em toda aplicação
 */
export { Validator };
