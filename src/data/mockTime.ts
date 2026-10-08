/** Stable time anchor keeps mock timestamps deterministic across SSR and hydration. */
export const MOCK_NOW_ISO = "2026-10-08T12:00:00.000Z";
export const MOCK_NOW_MS = new Date(MOCK_NOW_ISO).getTime();
