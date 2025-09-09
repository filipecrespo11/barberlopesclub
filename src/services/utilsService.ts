/**
 * Serviço de Utilitários
 * Centraliza funções auxiliares e utilitárias
 * 
 * @deprecated Considere usar os novos utilitários em src/utils/
 * Mantido para compatibilidade com código legado
 */

import { redirectToWhatsApp } from '@/app/utils/api';
import { APP_CONFIG } from '@/config/app';
import { Formatter, Validator, logger } from '@/utils';

export class UtilsService {
  
  // ==================== WHATSAPP ====================

  /**
   * Redireciona para WhatsApp com mensagem padrão
   */
  static abrirWhatsApp(): void {
    redirectToWhatsApp();
  }

  /**
   * Redireciona para WhatsApp com mensagem customizada
   */
  static abrirWhatsAppComMensagem(mensagem: string): void {
    const message = encodeURIComponent(mensagem);
    const url = `https://wa.me/${APP_CONFIG.whatsapp.number}?text=${message}`;
    window.open(url, '_blank');
  }

  // ==================== FORMATAÇÃO ====================

  /**
   * Formata telefone brasileiro
   */
  static formatarTelefone(telefone: string): string {
    const numero = telefone.replace(/\D/g, '');
    
    if (numero.length === 11) {
      return `(${numero.slice(0, 2)}) ${numero.slice(2, 7)}-${numero.slice(7)}`;
    } else if (numero.length === 10) {
      return `(${numero.slice(0, 2)}) ${numero.slice(2, 6)}-${numero.slice(6)}`;
    }
    
    return telefone;
  }

  /**
   * Remove formatação do telefone
   */
  static limparTelefone(telefone: string): string {
    return telefone.replace(/\D/g, '');
  }

  /**
   * Valida formato de telefone brasileiro
   */
  static validarTelefone(telefone: string): boolean {
    const numero = this.limparTelefone(telefone);
    return numero.length === 10 || numero.length === 11;
  }

  /**
   * Valida formato de email
   */
  static validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Formata data para padrão brasileiro
   */
  static formatarData(data: string | Date): string {
    try {
      const dateObj = typeof data === 'string' ? new Date(data) : data;
      return dateObj.toLocaleDateString('pt-BR');
    } catch {
      return String(data);
    }
  }

  /**
   * Formata data e hora para padrão brasileiro
   */
  static formatarDataHora(data: string | Date): string {
    try {
      const dateObj = typeof data === 'string' ? new Date(data) : data;
      return dateObj.toLocaleString('pt-BR');
    } catch {
      return String(data);
    }
  }

  // ==================== VALIDAÇÕES ====================

  /**
   * Valida CPF brasileiro
   */
  static validarCPF(cpf: string): boolean {
    const numero = cpf.replace(/\D/g, '');
    
    if (numero.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(numero)) return false;
    
    // Validação do primeiro dígito
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(numero[i]) * (10 - i);
    }
    let resto = soma % 11;
    const digito1 = resto < 2 ? 0 : 11 - resto;
    
    if (parseInt(numero[9]) !== digito1) return false;
    
    // Validação do segundo dígito
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(numero[i]) * (11 - i);
    }
    resto = soma % 11;
    const digito2 = resto < 2 ? 0 : 11 - resto;
    
    return parseInt(numero[10]) === digito2;
  }

  /**
   * Formata CPF
   */
  static formatarCPF(cpf: string): string {
    const numero = cpf.replace(/\D/g, '');
    
    if (numero.length === 11) {
      return `${numero.slice(0, 3)}.${numero.slice(3, 6)}.${numero.slice(6, 9)}-${numero.slice(9)}`;
    }
    
    return cpf;
  }

  // ==================== MANIPULAÇÃO DE STRINGS ====================

  /**
   * Capitaliza primeira letra de cada palavra
   */
  static capitalizarNome(nome: string): string {
    return nome
      .toLowerCase()
      .split(' ')
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join(' ');
  }

  /**
   * Remove acentos de uma string
   */
  static removerAcentos(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  /**
   * Gera slug a partir de um texto
   */
  static gerarSlug(texto: string): string {
    return this.removerAcentos(texto)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // ==================== UTILITÁRIOS DE DATA ====================

  /**
   * Verifica se uma data é hoje
   */
  static isHoje(data: string | Date): boolean {
    const hoje = new Date();
    const dataComparacao = typeof data === 'string' ? new Date(data) : data;
    
    return hoje.toDateString() === dataComparacao.toDateString();
  }

  /**
   * Verifica se uma data é amanhã
   */
  static isAmanha(data: string | Date): boolean {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    const dataComparacao = typeof data === 'string' ? new Date(data) : data;
    
    return amanha.toDateString() === dataComparacao.toDateString();
  }

  /**
   * Calcula diferença em dias entre duas datas
   */
  static diferencaEmDias(data1: string | Date, data2: string | Date): number {
    const date1 = typeof data1 === 'string' ? new Date(data1) : data1;
    const date2 = typeof data2 === 'string' ? new Date(data2) : data2;
    
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // ==================== UTILITÁRIOS DE ARRAY ====================

  /**
   * Remove duplicatas de array
   */
  static removerDuplicatas<T>(array: T[]): T[] {
    return [...new Set(array)];
  }

  /**
   * Agrupa array por uma propriedade
   */
  static agruparPor<T>(array: T[], propriedade: keyof T): Record<string, T[]> {
    return array.reduce((grupos, item) => {
      const chave = String(item[propriedade]);
      grupos[chave] = grupos[chave] || [];
      grupos[chave].push(item);
      return grupos;
    }, {} as Record<string, T[]>);
  }

  // ==================== UTILITÁRIOS DE LOCAL STORAGE ====================

  /**
   * Salva dados no localStorage com tratamento de erro
   */
  static salvarNoStorage(chave: string, valor: any): boolean {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(chave, JSON.stringify(valor));
        return true;
      }
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
    return false;
  }

  /**
   * Carrega dados do localStorage com tratamento de erro
   */
  static carregarDoStorage<T>(chave: string): T | null {
    try {
      if (typeof window !== 'undefined') {
        const item = localStorage.getItem(chave);
        return item ? JSON.parse(item) : null;
      }
    } catch (error) {
      console.error('Erro ao carregar do localStorage:', error);
    }
    return null;
  }

  /**
   * Remove item do localStorage
   */
  static removerDoStorage(chave: string): boolean {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(chave);
        return true;
      }
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
    }
    return false;
  }

  // ==================== UTILITÁRIOS DE NAVEGAÇÃO ====================

  /**
   * Faz scroll suave para um elemento
   */
  static scrollParaElemento(elementoId: string): void {
    const elemento = document.getElementById(elementoId);
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * Copia texto para área de transferência
   */
  static async copiarTexto(texto: string): Promise<boolean> {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(texto);
        return true;
      }
    } catch (error) {
      console.error('Erro ao copiar texto:', error);
    }
    return false;
  }
}
