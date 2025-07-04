import { NextRequest, NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';

// Interface para tipagem de agendamento
interface Agendamento {
  id: string;
  usuarioId: string;
  servico: string;
  data: string;
  horario: string;
  status: string;
  createdAt: string;
}

// Interface para payload do JWT
interface JwtPayload {
  userId: string;
  email: string;
}

// Simulação de banco de dados - substitua pela sua implementação
const agendamentos: Agendamento[] = [];

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-aqui';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Token de acesso requerido' },
        { status: 401 }
      );
    }    const token = authHeader.substring(7);
    let decoded: JwtPayload;
    
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
      return NextResponse.json(
        { message: 'Token inválido' },
        { status: 401 }
      );
    }    const { servico, data, horario } = await request.json();

    // Validações
    if (!servico || !data || !horario) {
      return NextResponse.json(
        { message: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se o horário já está ocupado
    const existingAgendamento = agendamentos.find(
      a => a.data === data && a.horario === horario
    );

    if (existingAgendamento) {
      return NextResponse.json(
        { message: 'Este horário já está ocupado' },
        { status: 400 }
      );
    }

    // Criar agendamento usando o ID do usuário autenticado
    const newAgendamento: Agendamento = {
      id: Date.now().toString(),
      usuarioId: decoded.userId,
      servico,
      data,
      horario,
      status: 'pendente',
      createdAt: new Date().toISOString()
    };

    agendamentos.push(newAgendamento);

    return NextResponse.json(
      { 
        message: 'Agendamento criado com sucesso',
        agendamento: newAgendamento
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Token de acesso requerido' },
        { status: 401 }
      );
    }    const token = authHeader.substring(7);
    let decoded: JwtPayload;
    
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
      return NextResponse.json(
        { message: 'Token inválido' },
        { status: 401 }
      );
    }

    // Buscar agendamentos do usuário
    const userAgendamentos = agendamentos.filter(
      a => a.usuarioId === decoded.userId
    );

    return NextResponse.json(
      { agendamentos: userAgendamentos },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
