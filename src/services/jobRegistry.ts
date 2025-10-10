import { createJobService } from './jobService';
import { createMemoryJobStore } from './jobStore/memoryStore';

// provide memory store by default for in-memory persistence with TTL cleanup
const mem = createMemoryJobStore();
export const jobService = createJobService({ store: mem });

// register a noop handler so API type 'noop' works
jobService.register('noop', async (_payload?: any) => {
  await new Promise((r) => setTimeout(r, 10));
  return { ok: true };
});

// default registry can be extended by tests or startup code
export default jobService;
