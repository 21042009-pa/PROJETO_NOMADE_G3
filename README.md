# NÔMADE — Sistema de Gestão de Estoque

Sistema web desenvolvido pelo Grupo 3 para gerenciamento de estoque, produtos, categorias, fornecedores, lotes, movimentações e usuários.

## Implementado

- API REST com Node.js, Express e MySQL.
- Tela de login integrada ao cadastro de usuários.
- Painel de controle com indicadores.
- Cadastro e exclusão de produtos.
- Cadastro e exclusão de categorias, fornecedores, lotes e usuários.
- Registro e consulta de movimentações de estoque.
- Persistência dos dados no MySQL.
- Interface responsiva.
- Upload de imagem de produto pela API.

## Como executar

### 1. Banco de dados

Execute `banco_de_dados_revisado.sql` no MySQL e confira se o banco `db_nomades_g3` foi criado.

### 2. Backend

Entre em `Back-end`, copie `.env.example` para `.env` e informe os dados do seu MySQL.

```bash
npm install
npm run dev
```

O sistema ficará disponível em `http://localhost:3000`.

### 3. Login inicial

O script SQL cria um usuário de desenvolvimento:

- **Login:** `admin`
- **Senha:** `admin123`

Altere/remova esse usuário antes de uma implantação real.

## Estrutura

```text
Back-end/
  src/
    config/
    controllers/
    repositories/
    routes/
    services/
front-end/nomade/
  index.html
  src/scripts/script.js
  src/styles/style.css
```

## Integração do NÔMADE

O layout e as telas presentes no arquivo `nomade.7z` foram incorporados ao projeto em `front-end/nomade/` e conectados à API do back-end.

### Login
- A tela inicial autentica em `POST /usuarios/login`.
- Usuário inicial: `admin`
- Senha inicial: `admin123`
- Após o login, as páginas internas exigem uma sessão no navegador.
- O botão **Sair** remove a sessão e retorna para a tela de login.

### Telas integradas
- Painel de Controle
- Inventário
- Produtos
- Entrada & Saída
- Usuários
- Relatórios
- Configurações

As telas de produtos, inventário, movimentações e usuários consultam os endpoints reais da API, substituindo os dados demonstrativos do layout original.
