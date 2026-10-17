/**
 * Structured application logger conforming to capped-buffer principles.
 */

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

const MAX_LOG_BUFFER = 50;
const logBuffer: LogEntry[] = [];

export const logger = {
  info(message: string, context?: Record<string, unknown>) {
    this.record('info', message, context);
  },

  warn(message: string, context?: Record<string, unknown>) {
    this.record('warn', message, context);
  },

  error(message: string, context?: Record<string, unknown>) {
    this.record('error', message, context);
  },

  record(level: LogLevel, message: string, context?: Record<string, unknown>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };

    if (logBuffer.length >= MAX_LOG_BUFFER) {
      logBuffer.shift();
    }
    logBuffer.push(entry);

    if (import.meta.env.DEV) {
      const formatted = `[FarmDirect ${level.toUpperCase()}] ${message}`;
      if (level === 'error') console.error(formatted, context);
      else if (level === 'warn') console.warn(formatted, context);
      else console.log(formatted, context);
    }
  },

  getRecentLogs(): LogEntry[] {
    return [...logBuffer];
  },
};
