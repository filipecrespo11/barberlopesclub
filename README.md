# 💈 Lopes Club - Barbearia

Uma landing page moderna e responsiva para a Barbearia Lopes Club, desenvolvida com Next.js 15 e Tailwind CSS.

## 🚀 Como executar o projeto

### Pré-requisitos
- Node.js 18+ instalado
- npm, yarn, pnpm ou bun

### Instalação e execução

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em modo desenvolvimento:
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 🎨 Tecnologias utilizadas

- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática 
- **Tailwind CSS 3** - Framework CSS utility-first
- **PostCSS** - Processador CSS
- **ESLint** - Linter para JavaScript/TypeScript

## 📱 Funcionalidades

- ✅ Design responsivo para todos os dispositivos
- ✅ Navegação suave entre seções
- ✅ Animações modernas e transições suaves
- ✅ Menu mobile hamburger funcional
- ✅ Integração com WhatsApp para agendamento
- ✅ Galeria interativa de trabalhos
- ✅ Informações completas de contato e localização
- ✅ SEO otimizado com metadata apropriada

## 🎯 Seções da Landing Page

1. **Hero** - Apresentação principal com call-to-actions
2. **Sobre** - Informações da barbearia e estatísticas
3. **Serviços** - Lista de serviços oferecidos com preços
4. **Localização** - Endereço, horários e informações de contato
5. **Galeria** - Showcase dos trabalhos realizados
6. **Agendamento** - Botões para agendamento online e WhatsApp

## 🛠️ Scripts disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm run start` - Executa build de produção
- `npm run lint` - Executa o linter

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🔧 Resolução de Problemas

### Tailwind CSS não funciona
Se as classes do Tailwind não estiverem sendo aplicadas:

1. Verifique se as dependências estão instaladas:
```bash
npm install -D tailwindcss@^3.4.0 postcss autoprefixer
```

2. Reinicialize o Tailwind:
```bash
npx tailwindcss init -p
```

3. Verifique se o `globals.css` está sendo importado no layout

### Warnings do VS Code sobre @tailwind
Consulte o arquivo `TAILWIND_VSCODE_SETUP.md` para configurar o VS Code corretamente.

### Imagens não carregam
Certifique-se que as imagens estão na pasta `public/assets/`:
- `backgroundhero.jpg` - Imagem de fundo do hero
- `lopesclubicon.png` - Logo da barbearia
- `foto-unidade-1.jpg` - Foto interior da unidade
- `foto-unidade-2.jpg` - Foto ambiente da barbearia
- `corte1.jpg`, `corte2.jpg`, `corte3.jpg`, `corte4.jpg` - Galeria de cortes

## 📁 Estrutura do Projeto

```
├── src/
│   └── app/
│       ├── globals.css          # Estilos globais e Tailwind
│       ├── (public)/
│       │   ├── layout.tsx       # Layout principal
│       │   └── page.tsx         # Página inicial
│       └── components/
│           ├── Header.tsx       # Cabeçalho com navegação
│           └── Footer.tsx       # Rodapé com informações
├── public/
│   └── assets/                  # Imagens e recursos
├── tailwind.config.js           # Configuração do Tailwind
├── postcss.config.js           # Configuração do PostCSS
└── next.config.ts              # Configuração do Next.js
```

## 🎨 Design System

### Cores Principais
- **Amarelo**: `#facc15` (yellow-400) - Cor primária da marca
- **Preto**: `#000000` - Cor secundária
- **Cinza**: Variações de gray para textos e backgrounds

### Tipografia
- **Fonte Principal**: Roboto (Google Fonts)
- **Pesos**: 400, 500, 600, 700, 900

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 📞 Contato e Suporte

Para dúvidas sobre o desenvolvimento ou customizações, entre em contato com a equipe técnica.

---

**Desenvolvido com ❤️ para a Barbearia Lopes Club**
