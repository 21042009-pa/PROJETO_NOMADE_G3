# Atualizações NÔMADE

## Alteração de senha

A tela **Configurações > Segurança** agora possui o botão **Alterar senha**.

O modal exige:

- senha atual;
- nova senha com no mínimo 6 caracteres;
- confirmação da nova senha.

A API utiliza:

```text
PUT /usuarios/:id/senha
```

Body JSON:

```json
{
  "senhaAtual": "...",
  "novaSenha": "...",
  "confirmarSenha": "..."
}
```

O backend confere a senha atual antes de atualizar a senha no banco.

## Esqueci minha senha

O botão foi adicionado à tela de login e permanece desabilitado por enquanto.

## Suporte

O item **Suporte** no menu hambúrguer abre `suporte.html`, que exibe **NÃO CHAME** centralizado.

## Ambiente

O arquivo `.env` não está incluído neste pacote. Mantenha o seu `.env` atual dentro de `Back-end/` ou copie `.env.example` para `.env` e preencha com seus dados locais.
