const formCliente = document.getElementById('formCliente');
const listaClientes = document.getElementById('listaClientes');
const buscaCliente = document.getElementById('buscaCliente');

let todosClientes = [];

async function carregarClientes() {
  try {
    const res = await fetch('/clientes');
    todosClientes = await res.json();
    renderizarClientes();
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Erro ao carregar clientes' });
  }
}

function renderizarClientes() {
  const termo = buscaCliente.value.toLowerCase();
  const filtrados = todosClientes.filter(c =>
    c.nome.toLowerCase().includes(termo) || c.email.toLowerCase().includes(termo)
  );

  listaClientes.innerHTML = '';
  filtrados.forEach(c => {
    const li = document.createElement('li');
    li.textContent = `${c.nome} - ${c.email}`;
    listaClientes.appendChild(li);
  });
}

buscaCliente.addEventListener('input', renderizarClientes);

formCliente.addEventListener('submit', async e => {
  e.preventDefault();
  const dados = Object.fromEntries(new FormData(formCliente));

  try {
    const res = await fetch('/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    const result = await res.json();

    if (!res.ok) {
      if (res.status === 409) {
        throw new Error(result.erro || 'Cliente duplicado');
      }
      throw new Error('Erro ao cadastrar cliente');
    }

    await Swal.fire({ icon: 'success', title: 'Cliente cadastrado!', timer: 1500, showConfirmButton: false });
    formCliente.reset();
    carregarClientes();
  } catch (err) {
    Swal.fire({ icon: 'warning', title: 'Ops!', text: err.message });
  }
});

carregarClientes();
