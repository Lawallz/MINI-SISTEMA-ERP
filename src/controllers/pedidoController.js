const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listar(req, res) {
  const pedidos = await prisma.pedido.findMany({
    include: {
      cliente: true,
      itens: {
        include: {
          produto: true
        }
      }
    }
  });
  res.json(pedidos);
}

async function criar(req, res) {
  const { clienteId, itens } = req.body;

  const produtos = await prisma.produto.findMany({
    where: { id: { in: itens.map(i => i.produtoId) } }
  });

  let total = 0;
  const itensPedido = itens.map(item => {
    const prod = produtos.find(p => p.id === item.produtoId);
    const subtotal = prod.preco * item.quantidade;
    total += subtotal;
    return {
      produtoId: prod.id,
      quantidade: item.quantidade
    };
  });

  const pedido = await prisma.pedido.create({
    data: {
      clienteId,
      total,
      itens: {
        create: itensPedido
      }
    },
    include: {
      itens: true
    }
  });

  // 🔁 Atualiza o estoque de cada produto após criar o pedido
  for (const item of itens) {
    await prisma.produto.update({
      where: { id: item.produtoId },
      data: {
        estoque: {
          decrement: item.quantidade
        }
      }
    });
  }

  res.status(201).json(pedido);
}

module.exports = { listar, criar };
