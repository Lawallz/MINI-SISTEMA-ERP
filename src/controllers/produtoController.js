const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listar(req, res) {
  const produtos = await prisma.produto.findMany();
  res.json(produtos);
}

async function criar(req, res) {
  const { nome, preco, estoque } = req.body;
  try {
    const novo = await prisma.produto.create({
      data: { nome, preco: parseFloat(preco), estoque: parseInt(estoque) }
    });
    res.status(201).json(novo);
  } catch (err) {
    if (err.code === 'P2002') {
      res.status(409).json({ erro: 'Produto com esse nome já existe.' });
    } else {
      res.status(500).json({ erro: 'Erro ao cadastrar produto.' });
    }
  }
}

async function atualizar(req, res) {
  const id = Number(req.params.id);
  const { nome, preco, estoque } = req.body;
  try {
    const atualizado = await prisma.produto.update({
      where: { id },
      data: { nome, preco: parseFloat(preco), estoque: parseInt(estoque) }
    });
    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar produto.' });
  }
}

async function deletar(req, res) {
  const id = Number(req.params.id);
  await prisma.produto.delete({ where: { id } });
  res.status(204).send();
}

module.exports = { listar, criar, atualizar, deletar };