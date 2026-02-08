import { Request } from 'express';

/** Safely get a string param from req.params or req.query (handles string | string[]) */
export function getParam(req: Request, key: string): string | undefined {
  const val = req.params[key] ?? req.query[key];
  if (val === undefined || val === null) return undefined;
  const single = Array.isArray(val) ? val[0] : val;
  return typeof single === 'string' ? single : undefined;
}
