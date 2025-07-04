import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// Interface para tipagem de usuário
interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  createdAt: string;
}

// Simulação de banco de dados - substitua pela sua implementação
const users: User[] = [];

export async function POST(request: NextRequest) {
  try {
    const { nome, email, telefone, senha } = await request.json();

    // Validações
    if (!nome || !email || !telefone || !senha) {
      return NextResponse.json(
        { message: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    if (senha.length < 6) {
      return NextResponse.json(
        { message: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar se o usuário já existe
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'Este email já está cadastrado' },
        { status: 400 }
      );
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(senha, 10);    // Criar usuário
    const newUser: User = {
      id: Date.now().toString(),
      nome,
      email,
      telefone,
      senha: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);    // Retornar sucesso (sem a senha)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { senha: _senha, ...userWithoutPassword } = newUser;
    
    return NextResponse.json(
      { 
        message: 'Usuário criado com sucesso',
        user: userWithoutPassword
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro no cadastro:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
