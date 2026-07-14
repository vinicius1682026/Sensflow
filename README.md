# SENSFLOW

Ferramentas gratuitas de sensibilidade de mouse para jogos FPS.
Site estático (HTML/CSS/JS puro), sem build step.

🔗 https://sensflow.tech

## Estrutura

```
.
├── .htaccess          # URLs limpas, HTTPS, detecção de idioma, cache
├── index.html         # roteador de idioma (raiz)
├── 404.html           # página de erro trilíngue
├── robots.txt
├── sitemap.xml
├── pt/ en/ es/        # as 6 páginas em cada idioma
├── css/style.css
└── js/
    ├── games.js        # dados de yaw dos jogos
    ├── converter.js    # lógica do conversor + eDPI
    ├── profile.js      # perfil salvo (localStorage)
    ├── lang-detect.js  # detecção automática de idioma
    └── lang-switch.js  # seletor manual de idioma
```

## Deploy

O repositório é implantado automaticamente na Hostinger.
O conteúdo da **raiz do repo** vai direto para `public_html/`.

Não há etapa de build: `git push` → deploy.

## Desenvolvimento local

Os caminhos são absolutos (`/css/style.css`), então **não abra os arquivos
com duplo clique** (`file://`) — o CSS não vai carregar. Use um servidor local:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Adicionar um novo jogo

Edite `js/games.js` e acrescente o jogo na categoria certa com seu valor de yaw:

```js
"Nome do Jogo": 0.022,
```

Referência de yaw por engine:
| Engine | Yaw | Exemplos |
|---|---|---|
| Source / Unity | `0.022` | CS2, Apex, Tarkov, Rust |
| Source 2 | `0.044` | Deadlock |
| Unreal / IW | `0.0066` | Overwatch 2, CoD, The Finals |
| Riot | `0.07` | Valorant |
| Anvil | `0.005729486` | Rainbow Six Siege |
