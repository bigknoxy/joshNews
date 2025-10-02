import http from 'http';
import { startServer as startAppServer } from '../../src/main';

export type StopFn = () => Promise<void>;

let serverInstance: http.Server | null = null;

export async function startTestServer(port?: number): Promise<StopFn> {
  const p = process.env.PORT ? Number(process.env.PORT) : port ?? 3000;
  serverInstance = await startAppServer(p);

  const stop: StopFn = async () => {
    if (!serverInstance) return;
    await new Promise<void>((resolve) => serverInstance!.close(() => resolve()));
    serverInstance = null;
  };

  return stop;
}

export async function stopTestServer(): Promise<void> {
  if (!serverInstance) return;
  await new Promise<void>((resolve) => serverInstance!.close(() => resolve()));
  serverInstance = null;
}
