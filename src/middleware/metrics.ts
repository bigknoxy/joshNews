import { IncomingMessage, ServerResponse } from 'http';

/**
 * Metrics middleware stub
 * Records request timing for dashboard endpoints
 */

interface MetricsData {
  method: string;
  path: string;
  duration: number;
  statusCode: number;
}

class MetricsCollector {
  private metrics: MetricsData[] = [];

  record(data: MetricsData): void {
    this.metrics.push(data);
    // Stub: log to console
    console.log(`[METRICS] ${data.method} ${data.path} - ${data.duration}ms (${data.statusCode})`);
  }

  getMetrics(): MetricsData[] {
    return [...this.metrics];
  }

  clear(): void {
    this.metrics = [];
  }
}

export const metricsCollector = new MetricsCollector();

/**
 * Middleware function to wrap handlers with timing
 */
export function withMetrics(handler: (req: IncomingMessage, res: ServerResponse) => Promise<void>) {
  return async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const start = Date.now();
    await handler(req, res);
    const duration = Date.now() - start;
    metricsCollector.record({
      method: req.method || 'UNKNOWN',
      path: req.url || '/',
      duration,
      statusCode: res.statusCode,
    });
  };
}
