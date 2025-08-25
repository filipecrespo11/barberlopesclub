import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/app/utils/api';
import { getServiceAuthToken } from '@/app/api/_serviceAuth';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const body = await req.json();
    const token = getServiceAuthToken(req.headers as any);
    const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.agendamentos.atualizar(id)}`;
    const resp = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: token, 'x-access-token': token.replace('Bearer ', '') } : {}),
      },
      body: JSON.stringify(body),
    });
    const data = await resp.json().catch(() => ({ success: false, message: 'Erro ao processar resposta do backend' }));
    return NextResponse.json(data, { status: resp.status });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || 'Erro no proxy de atualização' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const token = getServiceAuthToken(req.headers as any);
    const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.agendamentos.remover(id)}`;
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: token, 'x-access-token': token.replace('Bearer ', '') } : {}),
      },
    });
    const data = await resp.json().catch(() => ({ success: false, message: 'Erro ao processar resposta do backend' }));
    return NextResponse.json(data, { status: resp.status });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || 'Erro no proxy de exclusão' }, { status: 500 });
  }
}
