// ==========================================
// MODAL DE ATUALIZAÇÃO DE TELEFONE
// ==========================================
// Arquivo: src/app/components/PhoneModal.tsx
// Versão: 1.0
// Última atualização: 2025-09-09
// Autor: Barber Lopes Club Dev Team
// Descrição: Modal para coleta e atualização do número de telefone do usuário
// ==========================================

/**
 * PHONE MODAL - BARBER LOPES CLUB
 * ===============================
 * 
 * Modal específico para coleta e atualização do número de telefone
 * do usuário. Utilizado quando o telefone é obrigatório para 
 * funcionalidades específicas como agendamentos ou comunicação
 * via WhatsApp.
 * 
 * FUNCIONALIDADES PRINCIPAIS:
 * ===========================
 * - Formulário simples e focado para telefone
 * - Validação em tempo real do formato telefônico
 * - Integração com UtilsService para validação
 * - Feedback visual de carregamento e erros
 * - Atualização automática no perfil do usuário
 * - Callback de sucesso para componente pai
 * - Design responsivo e acessível
 * 
 * CASOS DE USO:
 * =============
 * - Usuário logou via Google sem telefone
 * - Telefone inválido ou desatualizado
 * - Primeira configuração do perfil
 * - Atualização por solicitação do usuário
 * - Habilitação de funcionalidades WhatsApp
 * 
 * VALIDAÇÃO DE TELEFONE:
 * =====================
 * - Formato brasileiro: (XX) XXXXX-XXXX
 * - Remoção automática de caracteres especiais
 * - Validação de comprimento mínimo
 * - Verificação de códigos de área válidos
 * - Feedback imediato de formato incorreto
 * 
 * FLUXO DE ATUALIZAÇÃO:
 * ====================
 * 1. Modal é aberto quando telefone necessário
 * 2. Usuário digita número com validação em tempo real
 * 3. Validação completa antes do envio
 * 4. Requisição para API de atualização
 * 5. Atualização do perfil local
 * 6. Callback de sucesso executado
 * 7. Modal fechado automaticamente
 * 
 * MANUTENÇÃO:
 * ===========
 * - Para alterar validação: modificar UtilsService.validarTelefone
 * - Para alterar formato: ajustar placeholder e máscara
 * - Para adicionar campos: estender formData state
 * - Para alterar API: modificar AuthService.atualizarTelefone
 * 
 * @author Sistema de Perfil - Lopes Club
 * @version 1.0
 * @lastModified 2025-09-09
 */

"use client";
import { useState } from "react";
import { AuthService, UtilsService } from "@/services";

interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PhoneModal({ isOpen, onClose, onSuccess }: PhoneModalProps) {
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!telefone.trim()) {
      setError("Por favor, informe seu telefone");
      return;
    }

    setLoading(true);
    setError("");

    // Validar telefone primeiro
    if (!UtilsService.validarTelefone(telefone)) {
      setError("Formato de telefone inválido");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      // Atualizar telefone no backend usando o serviço
      const response = await AuthService.atualizarTelefone(telefone);

      if (response.success) {
        // Atualizar dados locais
        const updatedUser = { ...user, tel: telefone, telefone };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        onSuccess();
      } else {
        setError(response.message || 'Erro ao atualizar telefone');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar telefone');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = UtilsService.formatarTelefone(e.target.value);
    setTelefone(formatted);
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Bem-vindo à Barbearia Lopes!
          </h2>
          <p className="text-gray-600">
            Para finalizar seu cadastro, precisamos do seu telefone para contato
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone *
            </label>
            <input
              type="tel"
              value={telefone}
              onChange={handlePhoneChange}
              placeholder="(22) 99999-9999"
              maxLength={15}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Usaremos apenas para confirmações de agendamento
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Pular por agora
            </button>
            <button
              type="submit"
              disabled={loading || !telefone.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
