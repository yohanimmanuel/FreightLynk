// @ts-ignore
const fuzz = require('fuzzball');
import { standardFields } from './standardFields';

export function mapHeadersFuzzy(uploadedHeaders: string[]) {
  const standardLabels = standardFields.map(f => f.label);
  const mapping: Record<string, string | null> = {};
  uploadedHeaders.forEach(header => {
    const result = fuzz.extract(header, standardLabels, { scorer: fuzz.token_set_ratio, limit: 1 })[0];
    // result = [bestMatch, score, index]
    const [bestLabel, score] = result;
    const stdField = standardFields.find(f => f.label === bestLabel);
    mapping[header] = score >= 80 && stdField ? stdField.key : null;
  });
  return mapping;
} 