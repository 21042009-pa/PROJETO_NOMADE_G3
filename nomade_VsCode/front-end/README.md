# Nômade — Sistema de Gestão de Estoque (front-end)

Front-end estático em HTML, CSS e JavaScript, integrado à API do projeto Nômade.

## Como rodar o projeto do zero

Guia para quem ainda não tem o ambiente configurado na máquina.

### 1. Pré-requisitos

Instale, se ainda não tiver:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [MySQL](https://dev.mysql.com/downloads/mysql/) (ou um gerenciador como XAMPP/MAMP com MySQL incluso)

Confirme que o Node está instalado:

```bash
node -v
```

### 2. Criar o banco de dados

Com o MySQL rodando na sua máquina, execute o script `schema.sql` que está na pasta `Back-end`. Ele cria o banco `db_nomades_g3` e todas as tabelas usadas pelo sistema.

```bash
mysql -u root -p < ../Back-end/schema.sql
```

(ajuste `-u root` para o seu usuário do MySQL; remova `-p` se não tiver senha configurada)

### 3. Configurar as variáveis de ambiente do back-end

Dentro da pasta `Back-end`, copie o arquivo de exemplo e ajuste se necessário:

```bash
cd ../Back-end
cp .env.example .env
```

### 4. Instalar as dependências e subir o back-end

Ainda dentro de `Back-end`:

```bash
npm install
npm run dev
```

Se aparecer `Conectado ao MySQL com sucesso!` e `Servidor rodando na porta 3000`, o back-end está no ar.

### 5. Abrir o front-end

Com o back-end rodando, acesse `http://localhost:3000` diretamente no navegador (o próprio Express já serve os arquivos do front-end).

Se preferir servir o front-end separadamente (ex: usando a extensão Live Server do VS Code), sirva a pasta `front-end` numa porta diferente da 3000, como a 5500 (veja a seção [Como abrir](#como-abrir) abaixo) — os scripts de integração detectam a porta automaticamente e direcionam as chamadas para a API em `localhost:3000`.

### 6. Primeiro login

O `schema.sql` já cria um usuário **Gerente** padrão para o primeiro acesso:

- Login: `admin`
- Senha: `admin123`

Troque essa senha pela tela de Configurações assim que entrar. Para criar outros usuários, use o cadastro público (tela de login, link "Criar conta") — ele sempre cria com cargo **Operador**; só um Gerente logado consegue atribuir outro cargo, pela tela de Usuários.

## Como abrir

A API deve estar executando (por padrão em `http://localhost:3000` quando os HTMLs são abertos via `file://`).
Para servir o front-end localmente:

```bash
python3 -m http.server 5500
```

Depois acesse `http://localhost:5500`.

## Organização CSS

`assets/css/style.css` concentra tokens de tema, layout e componentes compartilhados. Regras exclusivas ficam em `assets/css/pages/` e são carregadas apenas pelas páginas que as utilizam:

```text
assets/css/
├── style.css                 # base, tema e componentes compartilhados
└── pages/
    ├── login.css             # tela de autenticação
    ├── charts.css            # gráficos compartilhados por dashboard e relatórios
    ├── dashboard.css         # alertas específicos do painel
    ├── product-media.css     # imagens e área de upload de produtos
    └── support.css           # composição visual da página de suporte
```

As páginas de produtos e movimentação compartilham `product-media.css`; dashboard e relatórios compartilham `charts.css`. Os demais módulos específicos são incluídos apenas onde são utilizados.

## Semântica e acessibilidade

As páginas usam landmarks (`main`, `header`, `nav`), títulos em hierarquia, `section` nomeadas por seus títulos, rótulos ligados aos campos e tabelas com legenda e cabeçalhos de coluna. Componentes injetados por JavaScript devem manter os mesmos padrões; gráficos são expostos como imagens nomeadas com uma descrição dos dados.

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
