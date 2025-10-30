const formProduto = document.getElementById('formProduto');
const listaProdutos = document.getElementById('listaProdutos');
const buscaProduto = document.getElementById('buscaProduto');

let todosProdutos = [];

async function carregarProdutos() {
  try {
    const res = await fetch('/produtos');
    todosProdutos = await res.json();
    renderizarProdutos();
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Erro ao carregar produtos' });
  }
}

function renderizarProdutos() {
  const termo = buscaProduto.value.toLowerCase();
  const filtrados = todosProdutos.filter(p =>
    p.nome.toLowerCase().includes(termo)
  );

  listaProdutos.innerHTML = '';
  filtrados.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${p.nome} - R$ ${p.preco.toFixed(2)} - Estoque: ${p.estoque}`;
    listaProdutos.appendChild(li);
  });
}

buscaProduto.addEventListener('input', renderizarProdutos);

formProduto.addEventListener('submit', async e => {
  e.preventDefault();
  const dados = Object.fromEntries(new FormData(formProduto));
  dados.preco = parseFloat(dados.preco);
  dados.estoque = parseInt(dados.estoque);

  try {
    const res = await fetch('/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    const result = await res.json();

    if (!res.ok) {
      if (res.status === 409) {
        throw new Error(result.erro || 'Produto duplicado');
      }
      throw new Error('Erro ao cadastrar produto');
    }

    await Swal.fire({ icon: 'success', title: 'Produto cadastrado!', timer: 1500, showConfirmButton: false });
    formProduto.reset();
    carregarProdutos();
  } catch (err) {
    Swal.fire({ icon: 'warning', title: 'Atenção', text: err.message });
  }
});

carregarProdutos();
