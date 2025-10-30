async function atualizarDashboard() {
  try {
    const [clientesRes, produtosRes, pedidosRes, relatorioRes] = await Promise.all([
      fetch('/clientes'),
      fetch('/produtos'),
      fetch('/pedidos'),
      fetch('/relatorios/faturamento')
    ]);

    const clientes = await clientesRes.json();
    const produtos = await produtosRes.json();
    const pedidos = await pedidosRes.json();
    const relatorio = await relatorioRes.json();

    // Atualiza DOM
    document.getElementById('dashClientes').textContent = clientes.length;
    document.getElementById('dashProdutos').textContent = produtos.length;
    document.getElementById('dashPedidos').textContent = pedidos.length;

    // Relatório extra (formatado em moeda brasileira)
    document.getElementById('dashFaturamento').textContent = relatorio.faturamentoTotal.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    document.getElementById('dashMaisVendido').textContent = relatorio.produtoMaisVendido || '–';

  } catch (err) {
    console.error('Erro ao carregar dashboard:', err);
  }
}

atualizarDashboard();
setInterval(atualizarDashboard, 10000); // atualiza a cada 10s
