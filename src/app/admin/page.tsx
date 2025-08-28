"use client";
import { useState, useEffect } from "react";
import { apiRequest } from "@/app/utils/api";
import { useRouter } from "next/navigation";

function AdminLogin() {
  // Helpers para detecção robusta baseada SOMENTE nas informações vindas do backend
  const toStr = (v: any) => (v == null ? '' : String(v)).toLowerCase();
  const truthy = (v: any) => v === true || v === 'true' || v === 1 || v === '1' || toStr(v) === 'sim';
  const adminishWord = (s: string) => {
    const x = s.toLowerCase();
    return x === 'admin' || x === 'administrator' || x === 'administrador' || x === 'adm' ||
           x.includes('admin') || x.includes('adm') || x.includes('geren') || x.includes('manager') || x.includes('super') || x.includes('root') || x.includes('owner');
  };
  const hasAdminSignal = (obj: any, depth = 0): boolean => {
    if (!obj || depth > 3) return false;
    if (typeof obj === 'string') return adminishWord(obj);
    if (typeof obj === 'number') return obj >= 1; // níveis de acesso numéricos
    if (typeof obj === 'boolean') return obj === true;
    if (Array.isArray(obj)) return obj.some((v) => hasAdminSignal(v, depth + 1));
    if (typeof obj === 'object') {
      for (const [k, v] of Object.entries(obj)) {
        const key = toStr(k);
        if (/(admin|adm|geren|manager|super|root|owner|acess|nivel|role|perfil|permiss|tipo|papel|grupo|cargo|func|cat)/.test(key)) {
          if (truthy(v) || adminishWord(toStr(v))) return true;
          if (hasAdminSignal(v, depth + 1)) return true;
        }
      }
    }
    return false;
  };
  const isUserAdmin = (u: any): boolean => {
    if (!u || typeof u !== 'object') return false;
    if (truthy((u as any).isAdmin) || truthy((u as any).admin) || truthy((u as any).is_admin) || truthy((u as any).isAdm) || truthy((u as any).adm) || truthy((u as any).superuser)) return true;
    if (hasAdminSignal(u)) return true;
    return false;
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Decodifica JWT (informação vinda do backend)
  const decodeJwtClaims = (token?: string): any | null => {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;
    try {
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = atob(base64);
      return json ? JSON.parse(json) : null;
    } catch {
      return null;
    }
  };
  const isClaimsAdmin = (claims: any): boolean => {
    if (!claims || typeof claims !== 'object') return false;
    const truthy = (v: any) => v === true || v === 'true' || v === 1 || v === '1' || String(v).toLowerCase() === 'sim';
    if (truthy(claims.isAdmin) || truthy(claims.admin) || truthy(claims.is_admin)) return true;
    const s = (v: any) => (v == null ? '' : String(v)).toLowerCase();
    const role = s(claims.role || claims.perfil || claims.permissao || claims.tipo || claims.tipoUsuario || claims.tipo_usuario || claims.papel || claims.grupo);
    if (role === 'admin' || role === 'administrator' || role.includes('adm') || role.includes('geren') || role.includes('super') || role.includes('root')) return true;
    const arr = (claims.roles || claims.permissoes || claims.scopes || []) as any[];
    if (Array.isArray(arr) && arr.some((r) => s(typeof r === 'string' ? r : (r?.name || r?.role)).includes('adm'))) return true;
    const nivel = Number(claims.nivel || claims.nivelAcesso || claims.nivel_acesso || claims.accessLevel || 0);
    if (!Number.isNaN(nivel) && nivel >= 7) return true;
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await apiRequest("/auterota/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const usuario = res.usuario || res.user || res.data?.usuario || res.data?.user;
      const token = res.token || res.data?.token;
      const claims = decodeJwtClaims(token);
      const adminOk = isUserAdmin(usuario) || isClaimsAdmin(claims);
      if (process.env.NODE_ENV !== 'production') {
        console.log('👤 Usuario recebido do back:', usuario);
        console.log('🔐 Claims decodificadas:', claims);
        console.log('🔐 adminOk calculado:', adminOk);
      }
  // Considera sucesso pelo status 200 (apiRequest já lança erro para não-200)
  if (usuario && adminOk) {
        const toStore = { ...usuario, isAdmin: adminOk };
        localStorage.setItem("user", JSON.stringify(toStore));
        if (token) localStorage.setItem("token", token);
        window.location.reload(); // força re-render e atualização do estado
        return;
      } else {
        setError("Acesso negado. Apenas administradores podem entrar.");
      }
    } catch (err) {
      // Corrigido para evitar uso de 'any'
      if (err instanceof Error) {
        setError(err.message || "Erro ao autenticar.");
      } else {
        setError("Erro ao autenticar.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login Admin</h2>
        {error && (
          <div className="mb-4 text-red-600 text-center">{error}</div>
        )}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-medium">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

import AdminAgendamentosPanel from "../components/AdminAgendamentosPanel";

export default function AdminPage() {
  const [autenticado, setAutenticado] = useState(false);
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  // repetir helpers de cima (dentro do escopo do componente)
  const toStr = (v: any) => (v == null ? '' : String(v)).toLowerCase();
  const truthy = (v: any) => v === true || v === 'true' || v === 1 || v === '1' || toStr(v) === 'sim';
  const adminishWord = (s: string) => {
    const x = s.toLowerCase();
    return x === 'admin' || x === 'administrator' || x === 'administrador' || x === 'adm' ||
           x.includes('admin') || x.includes('adm') || x.includes('geren') || x.includes('manager') || x.includes('super') || x.includes('root') || x.includes('owner');
  };
  const hasAdminSignal = (obj: any, depth = 0): boolean => {
    if (!obj || depth > 3) return false;
    if (typeof obj === 'string') return adminishWord(obj);
    if (typeof obj === 'number') return obj >= 1;
    if (typeof obj === 'boolean') return obj === true;
    if (Array.isArray(obj)) return obj.some((v) => hasAdminSignal(v, depth + 1));
    if (typeof obj === 'object') {
      for (const [k, v] of Object.entries(obj)) {
        const key = toStr(k);
        if (/(admin|adm|geren|manager|super|root|owner|acess|nivel|role|perfil|permiss|tipo|papel|grupo|cargo|func|cat)/.test(key)) {
          if (truthy(v) || adminishWord(toStr(v))) return true;
          if (hasAdminSignal(v, depth + 1)) return true;
        }
      }
    }
    return false;
  };
  const isUserAdmin = (u: any): boolean => {
    if (!u || typeof u !== 'object') return false;
    if (truthy((u as any).isAdmin) || truthy((u as any).admin) || truthy((u as any).is_admin) || truthy((u as any).isAdm) || truthy((u as any).adm) || truthy((u as any).superuser)) return true;
    if (hasAdminSignal(u)) return true;
    return false;
  };

  useEffect(() => {
    function checkAdmin() {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          const token = localStorage.getItem('token') || localStorage.getItem('authToken') || '';
          // reuse helpers from above scope using function declarations
          const claims = ((): any => {
            try {
              if (!token) return null;
              const parts = token.split('.');
              if (parts.length < 2) return null;
              const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
              const json = atob(base64);
              return json ? JSON.parse(json) : null;
            } catch { return null; }
          })();
          const ok = isUserAdmin(user) || (claims && (function(c:any){
            const truthy = (v: any) => v === true || v === 'true' || v === 1 || v === '1' || String(v).toLowerCase() === 'sim';
            if (truthy(c.isAdmin) || truthy(c.admin) || truthy(c.is_admin)) return true;
            const s = (v: any) => (v == null ? '' : String(v)).toLowerCase();
            const role = s(c.role || c.perfil || c.permissao || c.tipo || c.tipoUsuario || c.tipo_usuario || c.papel || c.grupo);
            if (role === 'admin' || role === 'administrator' || role.includes('adm') || role.includes('geren') || role.includes('super') || role.includes('root')) return true;
            const arr = (c.roles || c.permissoes || c.scopes || []) as any[];
            if (Array.isArray(arr) && arr.some((r) => s(typeof r === 'string' ? r : (r?.name || r?.role)).includes('adm'))) return true;
            const nivel = Number(c.nivel || c.nivelAcesso || c.nivel_acesso || c.accessLevel || 0);
            if (!Number.isNaN(nivel) && nivel >= 7) return true;
            return false; })(claims));
          setAutenticado(!!ok);
        } catch {
          setAutenticado(false);
        }
      } else {
        setAutenticado(false);
      }
      setChecked(true);
    }
    checkAdmin();
    window.addEventListener("storage", checkAdmin);
    return () => window.removeEventListener("storage", checkAdmin);
  }, []);

  if (!checked) return null;
  return autenticado ? (
    <>
      <div className="flex justify-end p-12"></div>
      <div className="fixed top-4 right-4 z-[9999]">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 text-sm border rounded hover:bg-gray-50"
            onClick={() => {
              if (confirm('Deseja sair da conta de administrador?')) {
                try {
                  localStorage.removeItem('user');
                  localStorage.removeItem('token');
                  localStorage.removeItem('authToken');
                } catch {}
                window.location.reload();
              }
            }}
            title="Sair"
          >
            Sair
          </button>
          <button
            className="bg-blue-600 text-white px-3 py-2 text-sm rounded shadow hover:bg-blue-700 font-bold"
            onClick={() => {
              // Encontrar o painel e chamar a função openNew
              const event = new CustomEvent('openNewAgendamento');
              window.dispatchEvent(event);
            }}
          >
            Novo Agendamento
          </button>
          <button
            className="bg-yellow-500 text-black px-3 py-2 text-sm rounded shadow hover:bg-yellow-600 font-bold"
            onClick={() => router.push("/admin/criar-admin")}
          >
            Criar Novo Admin
          </button>
        </div>
      </div>
      <AdminAgendamentosPanel />
    </>
  ) : (
    <AdminLogin />
  );
}
