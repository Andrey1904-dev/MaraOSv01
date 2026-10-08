"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams as useNextSearchParams } from "next/navigation";

type SearchParamValues = Record<string, string>;
type SearchParamOptions = { replace?: boolean };

/**
 * Small App Router adapter for the design's existing search-param API.
 * Updates intentionally replace the complete query, matching React Router's
 * `setSearchParams` behavior used in the source design.
 */
export function useSearchParams() {
  const searchParams = useNextSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const setSearchParams = useCallback(
    (values: SearchParamValues, options?: SearchParamOptions) => {
      const next = new URLSearchParams();
      for (const [key, value] of Object.entries(values)) next.set(key, value);
      const query = next.toString();
      const href = query ? `${pathname}?${query}` : pathname;
      if (options?.replace) router.replace(href, { scroll: false });
      else router.push(href, { scroll: false });
    },
    [pathname, router],
  );

  return [searchParams, setSearchParams] as const;
}
