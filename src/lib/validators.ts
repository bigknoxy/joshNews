export type ValidationResult = { valid: boolean; errors: string[] };

export function validateSource(input: any): ValidationResult {
  const errors: string[] = [];
  if (!input || typeof input !== 'object') {
    errors.push('source must be an object');
    return { valid: false, errors };
  }
  if (!input.type || typeof input.type !== 'string') errors.push('type is required');
  if (!input.value || typeof input.value !== 'string') errors.push('value is required');
  try {
    // basic URL check when type is link
    if (input.type === 'link') {
      // eslint-disable-next-line no-new
      new URL(input.value);
    }
  } catch (e) {
    errors.push('value must be a valid url');
  }
  return { valid: errors.length === 0, errors };
}

export function validateContentItem(input: any): ValidationResult {
  const errors: string[] = [];
  if (!input || typeof input !== 'object') {
    errors.push('item must be an object');
    return { valid: false, errors };
  }
  if (!input.title || typeof input.title !== 'string') errors.push('title is required');
  if (!input.url || typeof input.url !== 'string') errors.push('url is required');
  try {
    new URL(input.url);
  } catch (e) {
    errors.push('url must be a valid url');
  }
  if (input.signal_explanations) {
    if (!Array.isArray(input.signal_explanations)) errors.push('signal_explanations must be an array');
    else if (input.signal_explanations.length > 3) errors.push('signal_explanations can have at most 3 items');
  }
  return { valid: errors.length === 0, errors };
}
