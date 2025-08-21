/**
 * Logging utility for Vibe MCP Server
 * Provides structured logging with different levels and proper error handling
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  error?: Error;
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;

  private constructor() {
    // Default to INFO level, can be overridden via environment variable
    this.logLevel = process.env.VIBE_LOG_LEVEL 
      ? parseInt(process.env.VIBE_LOG_LEVEL) 
      : LogLevel.INFO;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  public error(message: string, error?: Error, data?: any): void {
    this.log(LogLevel.ERROR, message, data, error);
  }

  public warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  public info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  public debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  private log(level: LogLevel, message: string, data?: any, error?: Error): void {
    if (level > this.logLevel) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      error
    };

    // Log to stderr for MCP protocol compliance (stdout is reserved for MCP messages)
    const levelName = LogLevel[level];
    const prefix = `[VibeMCP:${levelName}]`;
    
    if (level === LogLevel.ERROR && error) {
      console.error(`${prefix} ${message}`, error);
      if (data) {
        console.error(`${prefix} Additional data:`, data);
      }
    } else if (data) {
      console.error(`${prefix} ${message}`, data);
    } else {
      console.error(`${prefix} ${message}`);
    }
  }

  /**
   * Create a scoped logger for a specific component
   */
  public scope(scopeName: string): ScopedLogger {
    return new ScopedLogger(this, scopeName);
  }
}

/**
 * Scoped logger that prefixes all messages with a scope name
 */
export class ScopedLogger {
  constructor(
    private logger: Logger,
    private scopeName: string
  ) {}

  public error(message: string, error?: Error, data?: any): void {
    this.logger.error(`[${this.scopeName}] ${message}`, error, data);
  }

  public warn(message: string, data?: any): void {
    this.logger.warn(`[${this.scopeName}] ${message}`, data);
  }

  public info(message: string, data?: any): void {
    this.logger.info(`[${this.scopeName}] ${message}`, data);
  }

  public debug(message: string, data?: any): void {
    this.logger.debug(`[${this.scopeName}] ${message}`, data);
  }
}

// Export default logger instance
export const logger = Logger.getInstance();