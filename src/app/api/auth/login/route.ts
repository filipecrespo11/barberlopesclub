import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Simulação de banco de dados - substitua pela sua implementação
// Esta deveria ser a mesma referência do arquivo de cadastro
const users: any[] = [];

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-aqui';

export async function POST(request: NextRequest) {
  try {
    const { email, senha } = await request.json();

    // Validações
    if (!email || !senha) {
      return NextResponse.json(
        { message: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar usuário pelo email
    const user = users.find(u => u.email === email);
    if (!user) {
      return NextResponse.json(
        { message: 'Email ou senha incorretos' },
        { status: 401 }
      );
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(senha, user.senha);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Email ou senha incorretos' },
        { status: 401 }
      );
    }

    // Gerar JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Retornar sucesso (sem a senha)
    const { senha: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { 
        message: 'Login realizado com sucesso',
        user: userWithoutPassword,
        token
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
