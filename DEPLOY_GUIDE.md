# 🚀 Guia de Deploy - Lopes Club

## Plataformas de Deploy Recomendadas

### 1. Vercel (Recomendado)
A plataforma oficial do Next.js, com deploy automático:

```bash
# Instalar CLI da Vercel
npm i -g vercel

# Deploy
vercel

# Para produção
vercel --prod
```

**Configurações automáticas:**
- ✅ Next.js detectado automaticamente
- ✅ Build otimizado
- ✅ CDN global
- ✅ Domínio HTTPS gratuito

### 2. Netlify
Deploy simples com integração Git:

1. Conecte seu repositório Git
2. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `out` (se usando `next export`)

### 3. Deploy Manual (Servidor próprio)

#### Build para produção:
```bash
npm run build
npm start
```

#### Usando PM2 (para servidores Linux):
```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicação
pm2 start npm --name "lopes-club" -- start

# Salvar configuração
pm2 save
pm2 startup
```

## 📋 Checklist Pré-Deploy

### Imagens
- [ ] Todas as imagens estão na pasta `public/assets/`
- [ ] Imagens otimizadas (formato WebP recomendado)
- [ ] Alt texts configurados

### SEO
- [ ] Meta title e description configurados
- [ ] Favicon adicionado
- [ ] Open Graph tags (opcional)

### Performance
- [ ] Build executado sem erros: `npm run build`
- [ ] Linter sem warnings: `npm run lint`
- [ ] Todas as dependências instaladas

### Funcionalidades
- [ ] Menu mobile funcionando
- [ ] Links de navegação funcionando
- [ ] Botões de agendamento funcionando
- [ ] WhatsApp link configurado corretamente

## 🔧 Configurações de Produção

### Environment Variables (se necessário)
```bash
# .env.local
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your-ga-id
```

### Next.js Config para Deploy
```javascript
// next.config.ts
const nextConfig = {
  output: 'export', // Para sites estáticos
  trailingSlash: true,
  images: {
    unoptimized: true // Para export estático
  }
}
```

## 📊 Monitoramento

### Analytics Recomendados
- Google Analytics
- Vercel Analytics (se usando Vercel)
- Hotjar para heatmaps

### Performance
- Google PageSpeed Insights
- GTmetrix
- WebPageTest

---

**Nota:** Lembre-se de testar o site em diferentes dispositivos após o deploy!
