const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listar(req, res) {
  const clientes = await prisma.cliente.findMany();
  res.json(clientes);
}

async function criar(req, res) {
  const { nome, email, telefone } = req.body;
  try {
    const novo = await prisma.cliente.create({
      data: { nome, email, telefone }
    });
    res.status(201).json(novo);
  } catch (err) {
    if (err.code === 'P2002') {
      res.status(409).json({ erro: 'E-mail já cadastrado.' });
    } else {
      res.status(500).json({ erro: 'Erro ao cadastrar cliente.' });
    }
  }
}

async function atualizar(req, res) {
  const id = Number(req.params.id);
  const { nome, email, telefone } = req.body;
  try {
    const atualizado = await prisma.cliente.update({
      where: { id },
      data: { nome, email, telefone }
    });
    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar cliente.' });
  }
}

async function deletar(req, res) {
  const id = Number(req.params.id);
  await prisma.cliente.delete({ where: { id } });
  res.status(204).send();
}

module.exports = { listar, criar, atualizar, deletar };