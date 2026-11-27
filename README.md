# We Map It · site

Landing page da We Map It (wemapit.com.br): gestão de marketing e consultoria de branding.

Site estático em HTML, CSS e JavaScript puro, sem dependências nem etapa de build.
Hospedado na Hostinger: o conteúdo deste repositório vai direto para `public_html`.

## Estrutura

```
index.html        página principal
404.html          página de erro
css/style.css     estilos (tokens da paleta 2026, modos de cor, responsivo)
js/main.js        menu, animações, barra de progresso e pop-up de convite
assets/images/    foto do hero, imagem de compartilhamento, logos e ícones
.htaccess         HTTPS, compressão, cache e página 404
robots.txt / sitemap.xml
```

## Ao alterar CSS ou JS

O navegador guarda CSS e JS por 1 mês. Sempre que mudar `css/style.css` ou `js/main.js`,
aumente o número depois de `?v=` no `index.html` (e no `404.html`, no caso do CSS).
