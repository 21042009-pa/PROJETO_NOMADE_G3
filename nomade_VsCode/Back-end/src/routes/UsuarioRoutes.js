const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/UsuarioController");
const {
  autenticar,
  somenteGerente,
  somenteProprioUsuario,
} = require("../middlewares/autenticacao");

router.post("/login", UsuarioController.login);

router.use(autenticar);

router.post("/", somenteGerente, UsuarioController.cadastrarUsuario);
router.post("/logout", UsuarioController.logout);
router.get("/", somenteGerente, UsuarioController.listarUsuarios);
router.put("/:id/senha", somenteProprioUsuario, UsuarioController.alterarSenha);
router.get("/:id", UsuarioController.buscarUsuarioPorId);
router.put("/:id", somenteGerente, UsuarioController.atualizarUsuario);
router.delete("/:id", somenteGerente, UsuarioController.deletarUsuario);

module.exports = router;
