export interface ContentItem {
  id: string;
  title: string;
  url: string;
  sourceId: string | null;
  publishedAt: string;
  ingestedAt: string;
  snippet?: string;
  contentHash: string;
}

export function validateContentItem(item: unknown): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];
  if (!item || typeof item !== 'object') {
    return { valid: false, errors: ['item must be an object'] };
  }
  const it = item as Partial<ContentItem>;

  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!it.id || typeof it.id !== 'string' || !uuidRe.test(it.id)) {
    errors.push('id must be a valid uuid');
  }

  if (!it.title || typeof it.title !== 'string' || it.title.trim() === '') {
    errors.push('title must be a non-empty string');
  }

  if (!it.url || typeof it.url !== 'string') {
    errors.push('url must be a string');
  } else {
    try {
      const parsed = new URL(it.url);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        errors.push('url must be http or https');
      }
    } catch (e) {
      errors.push('url must be a valid absolute URL');
    }
  }

  if (it.sourceId !== null && it.sourceId !== undefined) {
    if (typeof it.sourceId !== 'string' || !uuidRe.test(it.sourceId)) {
      errors.push('sourceId must be null or a valid uuid');
    }
  }

  const checkIsoField = (val: unknown, name: string) => {
    if (!val || typeof val !== 'string') {
      errors.push(`${name} must be an ISO timestamp string`);
      return;
    }
    const t = Date.parse(val);
    if (!isFinite(t)) {
      errors.push(`${name} is not a valid date`);
      return;
    }
    try {
      const iso = new Date(val).toISOString();
      if (iso !== val) {
        errors.push(`${name} must be an ISO string (toISOString)`);
      }
    } catch (e) {
      errors.push(`${name} is not a valid date`);
    }
  };

  checkIsoField(it.publishedAt, 'publishedAt');
  checkIsoField(it.ingestedAt, 'ingestedAt');

  if (!it.contentHash || typeof it.contentHash !== 'string' || it.contentHash.trim() === '') {
    errors.push('contentHash must be a non-empty string');
  }

  return { valid: errors.length === 0, errors: errors.length ? errors : undefined };
}
