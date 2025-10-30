const express = require('express');
const router = express.Router();
const { gerarRelatorio } = require('../controllers/relatorioController');

router.get('/faturamento', gerarRelatorio);

module.exports = router;
