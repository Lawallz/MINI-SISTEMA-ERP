const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// import
app.use('/clientes', require('./routes/clienteRoutes'));
app.use('/produtos', require('./routes/produtoRoutes'));
app.use('/pedidos', require('./routes/pedidoRoutes'));

const relatorioRoutes = require('./routes/relatorioRoutes');
app.use('/relatorios', relatorioRoutes);

const usuarioRoutes = require('./routes/usuarioRoutes');
app.use('/usuarios', usuarioRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));


