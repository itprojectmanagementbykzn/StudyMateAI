// Minimal local types for Vercel Node serverless handlers, so the project does
// not need the heavy @vercel/node package just for type-checking. Vercel
// provides the real request/response objects at runtime, which are a superset
// of these. Files prefixed with "_" are ignored by Vercel's function routing.
import type { IncomingMessage, ServerResponse } from "http";

export interface VercelRequest extends IncomingMessage {
  body?: unknown;
}

export interface VercelResponse extends ServerResponse {
  status(statusCode: number): VercelResponse;
  json(body: unknown): VercelResponse;
}
