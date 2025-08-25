import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/app/utils/api';
import { getServiceAuthToken } from '@/app/api/_serviceAuth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = getServiceAuthToken(req.headers as any);
    const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.agendamentos.criar}`;

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: token, 'x-access-token': token.replace('Bearer ', '') } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await resp.json().catch(() => ({ success: false, message: 'Erro ao processar resposta do backend' }));
    return NextResponse.json(data, { status: resp.status });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || 'Erro no proxy de criação' }, { status: 500 });
  }
}
