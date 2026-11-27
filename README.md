# We Map It · site

Landing page da We Map It (wemapit.com.br): gestão de marketing e consultoria de branding.

Site estático em HTML, CSS e JavaScript puro, sem dependências nem etapa de build.

## Publicação (GitHub → Vercel)

Este repositório guarda o site e a Vercel publica a partir dele:

- **Push na `main`** publica em produção, em https://wemapit.com.br.
- **Push em qualquer outra branch** gera uma prévia com endereço próprio na Vercel,
  para conferir antes. Quando estiver certo, junte a branch na `main` (pull request
  ou merge) e a produção atualiza sozinha.

Não há etapa de build: a Vercel serve os arquivos da raiz do repositório como estão.
HTTPS, compressão e a página `404.html` ficam por conta da Vercel.

## Estrutura

```
index.html        página principal
404.html          página de erro (a Vercel usa automaticamente)
css/style.css     estilos (tokens da paleta 2026, modos de cor, responsivo)
js/main.js        menu, animações, barra de progresso e pop-up de convite
portfolio/        portfólio (wemapit.com.br/portfolio): página única, CSS e JS embutidos,
                  fotos do color grade em portfolio/assets/
assets/images/    foto do hero, imagem de compartilhamento, logos e ícones
vercel.json       configuração da Vercel (endereços sempre com barra no fim, ex.: /portfolio/)
robots.txt / sitemap.xml
```

## Ao alterar CSS ou JS

Mantenha o número depois de `?v=` no `index.html` (e no `404.html`, no caso do CSS)
e aumente-o quando mudar `css/style.css` ou `js/main.js`. Isso garante que quem já
visitou o site receba a versão nova, independentemente do cache do navegador.
