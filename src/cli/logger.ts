export interface Logger {
  info: (message: string) => void;
  error: (message: string) => void;
}

export function createLogger(options: { json?: boolean } = {}): Logger {
  const json = options.json || process.env.JSON_LOGS === 'true';

  if (json) {
    return {
      info: (message: string) => {
        console.log(
          JSON.stringify({ level: 'info', message, timestamp: new Date().toISOString() }),
        );
      },
      error: (message: string) => {
        console.error(
          JSON.stringify({ level: 'error', message, timestamp: new Date().toISOString() }),
        );
      },
    };
  } else {
    return {
      info: (message: string) => {
        console.log(message);
      },
      error: (message: string) => {
        console.error(message);
      },
    };
  }
}
