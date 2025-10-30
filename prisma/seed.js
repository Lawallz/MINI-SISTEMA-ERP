const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.cliente.createMany({
    data: [
      { nome: 'João Silva', email: 'joao@email.com', telefone: '1111-1111' },
      { nome: 'Maria Souza', email: 'maria@email.com', telefone: '2222-2222' }
    ]
  });

  await prisma.produto.createMany({
    data: [
      { nome: 'Caneta Azul', preco: 2.5, estoque: 100 },
      { nome: 'Caderno A4', preco: 15.0, estoque: 50 }
    ]
  });

  console.log('🟢 Dados de teste inseridos com sucesso!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
