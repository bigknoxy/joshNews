# Data Model — MVP News Service

TypeScript-like definitions

Source

- id: string
- name: string
- url: string
- type: 'rss' | 'http' | 'custom'
- enabled: boolean

ContentItem

- id: string
- sourceId: string
- title: string
- url: string
- excerpt?: string
- publishedAt?: string (ISO timestamp)
- fetchedAt: string (ISO timestamp)

User (minimal)

- id: string
- email: string
- createdAt: string

Storage adapters should implement following interface (pseudo):

interface StorageAdapter {
saveItem(item: ContentItem): Promise<void>;
listItems(opts?: { limit?: number; since?: string }): Promise<ContentItem[]>;
saveSource(source: Source): Promise<void>;
listSources(): Promise<Source[]>;
}
