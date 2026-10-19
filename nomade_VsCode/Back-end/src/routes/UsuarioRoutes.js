const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/UsuarioController");
const { autenticar, autenticarSeHouverToken, somenteGerente, somenteProprioUsuario } = require("../middlewares/autenticacao");

router.post("/login", UsuarioController.login);
// Cadastro público sempre cria um Operador; somente gerente pode atribuir outro cargo.
router.post("/", autenticarSeHouverToken, UsuarioController.cadastrarUsuario);

// As demais rotas de usuários exigem uma sessão válida.
router.use(autenticar);
router.post("/logout", UsuarioController.logout);
router.get("/", UsuarioController.listarUsuarios);
router.put("/:id/senha", somenteProprioUsuario, UsuarioController.alterarSenha);
router.get("/:id", UsuarioController.buscarUsuarioPorId);
router.put("/:id", somenteGerente, UsuarioController.atualizarUsuario);
router.delete("/:id", somenteGerente, UsuarioController.deletarUsuario);

module.exports = router;
