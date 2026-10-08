import { mockRepositories } from "./mock";

/**
 * Service locator for Mara OS data access.
 *
 * UI components never import mock data directly — they consume these
 * interfaces. To move to Supabase, implement the same interfaces in
 * `repositories/supabase.ts` and swap the export below.
 *
 *   export const repositories: Repositories = supabaseRepositories
 */
export const repositories = mockRepositories;

export type Repositories = typeof mockRepositories;
