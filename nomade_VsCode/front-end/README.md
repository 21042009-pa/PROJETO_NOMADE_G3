# Nômade — Sistema de Gestão de Estoque (front-end)

Front-end estático em HTML, CSS e JavaScript, integrado à API do projeto Nômade.

## Como abrir

A API deve estar executando (por padrão em `http://localhost:3000` quando os HTMLs são abertos via `file://`).
Para servir o front-end localmente:

```bash
python3 -m http.server 5500
```

Depois acesse `http://localhost:5500`.

## Estrutura JavaScript

```text
assets/js/
├── app.js                         # componentes genéricos de interface
├── layout/
│   ├── icons.js                   # SVGs compartilhados
│   └── layout.js                  # menu hambúrguer, topbar, usuário e navegação
└── integration/
    ├── core.js                    # API, sessão e helpers
    ├── auth.js                    # index.html
    ├── dashboard.js               # dashboard.html
    ├── estoque.js                 # estoque.html
    ├── produtos.js                # produtos.html
    ├── movimentacao.js            # movimentacao.html
    ├── usuarios.js                # usuarios.html
    ├── relatorios.js              # relatorios.html
    └── configuracoes.js           # configuracoes.html
```

Cada HTML carrega apenas o script de integração correspondente à própria página, além dos arquivos compartilhados necessários.

## Ordem dos scripts nas páginas internas

1. Bootstrap
2. `layout/icons.js`
3. `layout/layout.js`
4. `app.js`
5. `integration/core.js`
6. `integration/<pagina>.js`

A página `index.html` carrega somente Bootstrap, `integration/core.js` e `integration/auth.js`.

## Execução local

O back-end deve estar ativo em `http://localhost:3000`. O front-end pode ser aberto pelo Express na porta 3000 ou pelo Live Server; os módulos de integração detectam a porta e direcionam as chamadas da API corretamente.

Para testar o cadastro/login, inicie primeiro o servidor Node do back-end e confirme no terminal as mensagens `Conectado ao MySQL com sucesso!` e `Servidor rodando na porta 3000`.

## Navegação

- O menu principal é um painel hambúrguer (off-canvas) em desktop e mobile.
- `Configurações` não aparece no menu lateral.
- Clique no usuário no canto superior direito para abrir `Configurações` ou `Sair`.


## Tema claro

O tema global é controlado por `assets/js/theme.js`. A preferência é salva em `localStorage` na chave `nomade_theme`.

- `dark`: tema escuro original.
- `light`: tema claro com `#0000FF` como cor principal, sidebar azul e superfícies claras.

O switch em Configurações aplica a mudança imediatamente e ela permanece ativa entre páginas e recarregamentos.
