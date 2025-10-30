const express = require('express');
const router = express.Router();
const { registrarUsuario, login } = require('../controllers/usuarioController');

router.post('/registrar', registrarUsuario);
router.post('/login', login);

module.exports = router;
