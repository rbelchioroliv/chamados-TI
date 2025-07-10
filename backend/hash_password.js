// backend/hash_password.js
import bcrypt from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Digite a nova senha que você deseja usar: ', (password) => {
  if (!password) {
    console.error("Senha não pode ser vazia.");
    rl.close();
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  console.log("\nSenha criptografada (hash) gerada com sucesso!");
  console.log("-------------------------------------------------");
  console.log(hash);
  console.log("-------------------------------------------------");
  console.log("\nCopie a string acima e use no seu comando UPDATE no Beekeeper.");

  rl.close();
});