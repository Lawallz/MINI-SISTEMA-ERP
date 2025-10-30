const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const gerarRelatorio = async (req, res) => {
  try {
    const totalPedidos = await prisma.pedido.count();

    const pedidos = await prisma.pedido.findMany({
      include: { produto: true },
    });

    let faturamentoTotal = 0;
    const vendasPorProduto = {};

    pedidos.forEach((pedido) => {
      const totalPedido = pedido.quantidade * pedido.produto.preco;
      faturamentoTotal += totalPedido;

      const nomeProduto = pedido.produto.nome;
      vendasPorProduto[nomeProduto] = (vendasPorProduto[nomeProduto] || 0) + pedido.quantidade;
    });

    // Produto mais vendido
    let produtoMaisVendido = null;
    let maiorQuantidade = 0;

    for (const nome in vendasPorProduto) {
      if (vendasPorProduto[nome] > maiorQuantidade) {
        maiorQuantidade = vendasPorProduto[nome];
        produtoMaisVendido = nome;
      }
    }

    return res.json({
      totalPedidos,
      faturamentoTotal,
      produtoMaisVendido,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Erro ao gerar relatório' });
  }
};

module.exports = {
  gerarRelatorio,
};
