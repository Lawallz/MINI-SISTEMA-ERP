const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const SECRET = 'seu_token_secreto_aqui'; // depois coloca isso em .env

async function registrarUsuario(req, res) {
  const { nome, email, senha } = req.body;

  const senhaHash = await bcrypt.hash(senha, 10);

  try {
    const novoUsuario = await prisma.usuario.create({
      data: { nome, email, senha: senhaHash },
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao registrar usuário' });
  }
}

async function login(req, res) {
  const { email, senha } = req.body;

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) return res.status(401).json({ erro: 'Credenciais inválidas' });

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) return res.status(401).json({ erro: 'Credenciais inválidas' });

  const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET, {
    expiresIn: '1h',
  });

  res.json({ token });
}

module.exports = { registrarUsuario, login };
