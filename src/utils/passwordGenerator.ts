/**
 * Utilitário para geração de senhas temporárias seguras
 */

/**
 * Gera uma senha temporária aleatória segura
 * @param length Comprimento da senha (padrão: 12 caracteres)
 * @returns Senha temporária gerada
 */
export function generateTempPassword(length: number = 12): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%&*';
  
  const allChars = uppercase + lowercase + numbers + special;
  
  // Garantir que a senha tenha pelo menos um caractere de cada tipo
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Preencher o resto com caracteres aleatórios
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Embaralhar os caracteres para evitar padrões previsíveis
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

