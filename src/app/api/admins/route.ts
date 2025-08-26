import { NextResponse } from 'next/server';
import { getServiceAuthToken } from '@/app/api/_serviceAuth';
import { API_CONFIG } from '@/app/utils/api';

export async function POST(req: Request) {
  try {
    const incoming = await req.json().catch(() => ({}));
    // Apenas os campos que o backend espera
    const payload = {
      nome_completo: incoming.nome_completo ?? incoming.nome ?? '',
      username: incoming.username ?? incoming.email ?? '',
      password: incoming.password ?? '',
      tel: incoming.tel ?? incoming.telefone ?? '',
      email: incoming.email ?? '',
    };

    const baseURL = API_CONFIG?.baseURL || process.env.NEXT_PUBLIC_API_URL || '';
    if (!baseURL) {
      return NextResponse.json({ message: 'Backend base URL não configurada' }, { status: 500 });
    }

  const authHeader = getServiceAuthToken(req.headers as any);
  // Deriva token "nu" para x-access-token
  const bareToken = authHeader?.replace(/^Bearer\s+/i, '') || '';
  const resp = await fetch(`${baseURL}/auterota/criar-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
    ...(authHeader ? { Authorization: authHeader } : {}),
    ...(bareToken ? { 'x-access-token': bareToken } : {}),
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    let data: any = null;
    try { data = await resp.json(); } catch {}

    if (!resp.ok) {
      const message =
        resp.status === 401 ? (data?.message || 'Não autenticado ou token inválido/expirado') :
        resp.status === 403 ? (data?.message || 'Permissão negada pelo backend') :
        (data?.message || 'Erro ao criar admin');
      return NextResponse.json({ message, error: data }, { status: resp.status });
    }
    return NextResponse.json(data || { success: true });
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || 'Erro interno' }, { status: 500 });
  }
}
