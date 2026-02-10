import { customAlphabet } from 'nanoid';

// solo letras minúsculas + números (igual que tu ejemplo)
const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';

const nano = customAlphabet(alphabet, 19);

export function generateId(prefix: string): string {
  return `${prefix}-${nano()}`;
}
