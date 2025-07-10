import { standardFields } from './standardFields';
import fieldSynonyms from './fieldSynonyms.json';

// Simple Levenshtein distance for fuzzy matching
function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return matrix[a.length][b.length];
}

// Fuzzy match a header to a list of candidates
function fuzzyMatch(header: string, candidates: string[]): { match: string, score: number } {
  let best = { match: '', score: 0 };
  for (const candidate of candidates) {
    const dist = levenshtein(header.toLowerCase(), candidate.toLowerCase());
    const maxLen = Math.max(header.length, candidate.length);
    const score = maxLen === 0 ? 1 : 1 - dist / maxLen;
    if (score > best.score) best = { match: candidate, score };
  }
  return best;
}

// Get user-defined mappings from localStorage
function getUserMappings(): Record<string, string> {
  try {
    const stored = localStorage.getItem('userHeaderMappings');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function mapHeadersFuzzy(uploadedHeaders: string[]): Record<string, string | null> {
  const mapping: Record<string, string | null> = {};
  const userMappings = getUserMappings();

  uploadedHeaders.forEach(header => {
    // 1. User correction (localStorage)
    if (userMappings[header]) {
      mapping[header] = userMappings[header];
      return;
    }
    // 2. Synonym config (exact or fuzzy)
    let bestKey = null;
    let bestScore = 0.7; // threshold for fuzzy match
    for (const [key, synonyms] of Object.entries(fieldSynonyms)) {
      for (const synonym of synonyms) {
        if (header.toLowerCase() === synonym.toLowerCase()) {
          mapping[header] = key;
          return;
        }
        const { score } = fuzzyMatch(header, [synonym]);
        if (score > bestScore) {
          bestScore = score;
          bestKey = key;
        }
      }
    }
    mapping[header] = bestKey;
  });
  return mapping;
}

// Save user correction
export function saveUserMapping(header: string, key: string) {
  const mappings = getUserMappings();
  mappings[header] = key;
  localStorage.setItem('userHeaderMappings', JSON.stringify(mappings));
} 