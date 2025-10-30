async function atualizarDashboard() {
  try {
    const [clientesRes, produtosRes, pedidosRes] = await Promise.all([
      fetch('/clientes'),
      fetch('/produtos'),
      fetch('/pedidos')
    ]);

    const clientes = await clientesRes.json();
    const produtos = await produtosRes.json();
    const pedidos = await pedidosRes.json();

    // Atualiza DOM
    document.getElementById('dashClientes').textContent = clientes.length;
    document.getElementById('dashProdutos').textContent = produtos.length;
    document.getElementById('dashPedidos').textContent = pedidos.length;
  } catch (err) {
    console.error('Erro ao carregar dashboard:', err);
  }
}

atualizarDashboard();
setInterval(atualizarDashboard, 10000); // atualiza a cada 10s
