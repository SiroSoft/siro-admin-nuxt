// Appends hand-maintained helper types to the generated api.ts.
// Idempotent: guarded by BEGIN/END markers so regeneration never duplicates.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const FILE = 'src/types/api.ts';
const MARK_BEGIN = '// === HAND TYPES (kept across regeneration) ===';
const MARK_END = '// === END HAND TYPES ===';

if (!existsSync(FILE)) {
  console.error(`[append-api-helpers] ${FILE} not found. Run openapi-typescript first.`);
  process.exit(1);
}

let src = readFileSync(FILE, 'utf8');

if (src.includes(MARK_BEGIN)) {
  // Strip old block, re-append fresh definitions below.
  src = src.slice(0, src.indexOf(MARK_BEGIN)).trimEnd() + '\n';
}

const block = `
${MARK_BEGIN}
export interface PaginationParams {
  page?: number
  per_page?: number
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
  status?: string
}

export interface PaginationMeta {
  page: number
  last_page: number
  per_page: number
  total: number
}

export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  errors?: Record<string, string[]>
}
${MARK_END}
`;

writeFileSync(FILE, src.trimEnd() + '\n\n' + block);
console.log('[append-api-helpers] helpers ensured');
