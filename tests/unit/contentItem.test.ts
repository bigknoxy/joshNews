import { describe, test, expect } from 'bun:test';
import { validateContentItem, ContentItem } from '../../src/models/contentItem';

// These tests are written before implementation (TDD). They should fail until models are implemented.

describe('ContentItem model validation', () => {
  test('valid content item passes validation', () => {
    const item: ContentItem = {
      id: '11111111-1111-4111-8111-111111111111',
      title: 'Example article',
      url: 'https://example.com/article/1',
      sourceId: null,
      publishedAt: '2025-09-30T08:00:00.000Z',
      ingestedAt: '2025-10-01T09:00:00.000Z',
      snippet: 'Short summary of the article',
      contentHash: 'abcd1234',
    };

    const result = validateContentItem(item);
    expect(result.valid).toBe(true);
  });

  test('invalid url fails validation', () => {
    const item = {
      id: '11111111-1111-4111-8111-111111111111',
      title: 'Example article',
      url: 'not-a-url',
      sourceId: null,
      publishedAt: '2025-09-30T08:00:00.000Z',
      ingestedAt: '2025-10-01T09:00:00.000Z',
      snippet: 'Short summary',
      contentHash: 'abcd1234',
    } as unknown as ContentItem;

    const result = validateContentItem(item);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
  });

  test('missing required field returns invalid', () => {
    const item = {
      title: 'Missing id',
      url: 'https://example.com',
      sourceId: null,
      publishedAt: '2025-09-30T08:00:00.000Z',
      ingestedAt: '2025-10-01T09:00:00.000Z',
      snippet: 'Summary',
      contentHash: 'hash',
    } as unknown as ContentItem;

    const result = validateContentItem(item);
    expect(result.valid).toBe(false);
  });
});
