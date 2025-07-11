// test_connection.js
import { PrismaClient } from '@prisma/client';

// ATENÇÃO: Cole aqui a MESMA E EXATA URL que você colocou no Render
// Substitua [SUA_SENHA_SIMPLES] pela senha simples que você criou (ex: bancodedados123)
const DATABASE_URL = "postgresql://postgres:[SUA_SENHA_SIMPLES]@db.cseurfitvydkcnekofvg.supabase.co:5432/postgres?sslmode=require";

// Passamos a URL diretamente para o construtor para o teste
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

async function main() {
  console.log("Tentando conectar ao banco de dados do Supabase...");
  try {
    await prisma.$connect();
    console.log("✅ Conexão com o banco de dados do Supabase BEM-SUCEDIDA!");
  } catch (error) {
    console.error("❌ FALHA ao conectar com o banco de dados!");
    console.error(error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();