# Lopes Club - Barbearia

Uma landing page moderna e responsiva para a Barbearia Lopes Club.

## 🚀 Como executar o projeto

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em modo desenvolvimento:
```bash
npm run dev
```

4. Abra o navegador em: http://localhost:3000

### Scripts disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm run start` - Executa build de produção
- `npm run lint` - Executa o linter

## 🎨 Tecnologias utilizadas

- **Next.js 15** - Framework React
- **React 19** - Biblioteca JavaScript
- **TypeScript** - Tipagem estática
- **Tailwind CSS 3** - Framework CSS
- **PostCSS** - Processador CSS

## 📱 Funcionalidades

- ✅ Design responsivo
- ✅ Navegação suave entre seções
- ✅ Animações modernas
- ✅ Menu mobile
- ✅ Integração com WhatsApp
- ✅ Galeria de trabalhos
- ✅ Informações de contato

## 🎯 Seções da Landing Page

1. **Hero** - Apresentação principal
2. **Sobre** - Informações da barbearia
3. **Serviços** - Lista de serviços e preços
4. **Galeria** - Fotos dos trabalhos
5. **Localização** - Endereço e contato
6. **Agendamento** - CTAs para agendamento

## 🛠️ Problemas conhecidos e soluções

### Tailwind CSS não funciona
Se as classes do Tailwind não estiverem funcionando:

1. Verifique se as dependências estão instaladas:
```bash
npm install -D tailwindcss@^3.4.0 postcss autoprefixer
```

2. Reinicialize o Tailwind:
```bash
npx tailwindcss init -p
```

3. Verifique se o `globals.css` está sendo importado corretamente no layout.

### Imagens não carregam
Certifique-se que as imagens estão na pasta `public/assets/`:
- backgroundhero.jpg
- lopesclubicon.png
- foto-unidade-1.jpg
- foto-unidade-2.jpg
- corte1.jpg, corte2.jpg, corte3.jpg, corte4.jpg

## 📞 Contato

Para dúvidas sobre o projeto, entre em contato com a equipe de desenvolvimento.
