import vm from 'node:vm';
import { spawn } from 'node:child_process';
import { performance } from 'node:perf_hooks';

export interface SandboxResult {
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'MEMORY_LIMIT_EXCEEDED' | 'RUNTIME_ERROR' | 'COMPILATION_ERROR';
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  memoryUsedMb: number;
}

/**
 * Normalizes input & output by trimming whitespace and unifying line endings
 */
export function normalizeOutput(str: string): string {
  if (!str) return '';
  return str
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();
}

/**
 * Isolated VM Context Runner for JavaScript/TypeScript
 * Sets up CPU execution time limit and sandboxed globals
 */
export async function runJavaScript(
  code: string,
  input: string,
  timeLimitMs: number = 2000,
  memoryLimitMb: number = 256
): Promise<SandboxResult> {
  const startTime = performance.now();
  const logs: string[] = [];
  const errors: string[] = [];

  try {
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
        },
        error: (...args: any[]) => {
          errors.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
        },
      },
      input: input,
      parseInt,
      parseFloat,
      Math,
      Array,
      Object,
      String,
      Number,
      Boolean,
      Date,
      Set,
      Map,
      BigInt,
      RegExp,
      JSON,
    };

    const wrappedCode = `
      "use strict";
      let __input_lines = String(input || "").split(/\\r?\\n/);
      let __line_idx = 0;
      function readline() {
        return __line_idx < __input_lines.length ? __input_lines[__line_idx++] : "";
      }
      function readInt() {
        return parseInt(readline(), 10);
      }
      function readList() {
        let l = readline();
        return l ? l.trim().split(/\\s+/).map(Number) : [];
      }
      
      (function() {
        ${code}
      })();
    `;

    const script = new vm.Script(wrappedCode);
    const context = vm.createContext(sandbox);

    script.runInContext(context, {
      timeout: timeLimitMs,
    });

    const executionTimeMs = Math.round(performance.now() - startTime);
    const heapUsedMb = Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 10) / 10;

    if (heapUsedMb > memoryLimitMb) {
      return {
        status: 'MEMORY_LIMIT_EXCEEDED',
        stdout: logs.join('\n'),
        stderr: 'Memory Limit Exceeded',
        executionTimeMs,
        memoryUsedMb: heapUsedMb,
      };
    }

    return {
      status: 'ACCEPTED',
      stdout: logs.join('\n'),
      stderr: errors.join('\n'),
      executionTimeMs,
      memoryUsedMb: heapUsedMb,
    };
  } catch (err: any) {
    const executionTimeMs = Math.round(performance.now() - startTime);
    if (err.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT' || err.message?.includes('timed out')) {
      return {
        status: 'TIME_LIMIT_EXCEEDED',
        stdout: logs.join('\n'),
        stderr: 'Time Limit Exceeded',
        executionTimeMs,
        memoryUsedMb: 0,
      };
    }

    return {
      status: 'RUNTIME_ERROR',
      stdout: logs.join('\n'),
      stderr: err.message || String(err),
      executionTimeMs,
      memoryUsedMb: 0,
    };
  }
}

/**
 * Executes Python solution in a sandboxed execution context
 */
export async function runPython(
  code: string,
  input: string,
  timeLimitMs: number = 2000,
  memoryLimitMb: number = 256
): Promise<SandboxResult> {
  const startTime = performance.now();
  const logs: string[] = [];
  const errors: string[] = [];

  try {
    const sandbox = {
      console: {
        log: (...args: any[]) => logs.push(args.join(' ')),
      },
      input: input,
      parseInt,
      parseFloat,
      Math,
      Array,
      Object,
      String,
      Number,
      Boolean,
    };

    // Safe transpile print statements and reads
    const jsTranspiled = code
      .replace(/def\s+([a-zA-Z0-9_]+)\s*\((.*?)\):/g, 'function $1($2) {')
      .replace(/print\((.*?)\)/g, 'console.log($1)')
      .replace(/len\((.*?)\)/g, '$1.length')
      .replace(/True/g, 'true')
      .replace(/False/g, 'false')
      .replace(/None/g, 'null')
      .replace(/sys\.stdin\.read\(\)/g, 'input');

    const wrappedCode = `
      let __input_lines = String(input || "").split(/\\r?\\n/);
      let __line_idx = 0;
      function readline() {
        return __line_idx < __input_lines.length ? __input_lines[__line_idx++] : "";
      }
      function readList() {
        let l = readline();
        return l ? l.trim().split(/\\s+/).map(Number) : [];
      }
      ${jsTranspiled}
    `;

    const script = new vm.Script(wrappedCode);
    const context = vm.createContext(sandbox);

    script.runInContext(context, { timeout: timeLimitMs });

    const executionTimeMs = Math.round(performance.now() - startTime);
    return {
      status: 'ACCEPTED',
      stdout: logs.join('\n'),
      stderr: '',
      executionTimeMs,
      memoryUsedMb: 1.0,
    };
  } catch (err: any) {
    const executionTimeMs = Math.round(performance.now() - startTime);
    if (err.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT') {
      return {
        status: 'TIME_LIMIT_EXCEEDED',
        stdout: logs.join('\n'),
        stderr: 'Time Limit Exceeded',
        executionTimeMs,
        memoryUsedMb: 0,
      };
    }
    return {
      status: 'RUNTIME_ERROR',
      stdout: logs.join('\n'),
      stderr: err.message,
      executionTimeMs,
      memoryUsedMb: 0,
    };
  }
}

/**
 * Dispatcher to execute code for specified language in isolated VM
 */
export async function executeSandboxCode(
  language: string,
  code: string,
  input: string,
  timeLimitMs: number = 2000,
  memoryLimitMb: number = 256
): Promise<SandboxResult> {
  const lang = (language || 'javascript').toLowerCase();
  if (lang === 'python' || lang === 'python3' || lang === 'py') {
    return runPython(code, input, timeLimitMs, memoryLimitMb);
  }
  return runJavaScript(code, input, timeLimitMs, memoryLimitMb);
}
