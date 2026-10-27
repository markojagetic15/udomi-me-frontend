---
name: add-api-hook
description: Use when adding a new backend-API-backed data hook (query or mutation) in the Udomi Me frontend's _entities layer. Covers TanStack Query key conventions and cache invalidation.
---

# Add an API hook

All backend calls live in `src/_entities/<domain>/api/`, one file per hook, re-exported from `src/_entities/<domain>/api/index.ts` and `src/_entities/<domain>/index.ts`. Never call `axios`/`useAxios()` directly from a page or feature hook — always go through an entity API hook.

## Read (query)

```ts
import { useAxios } from '_app';
import { useQuery } from '@tanstack/react-query';

export const useGetXxx = (...args) => {
  const { axios } = useAxios();
  const getXxx = useQuery({
    queryKey: ['xxx', ...args],       // include every param that changes the result
    queryFn: async () => axios.get(`/xxx`),
  });
  return { getXxx };
};
```

The axios response interceptor already unwraps `.data` — `queryFn` returns the real payload, not an Axios response object.

## Write (mutation)

```ts
import { useAxios } from '_app';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateXxx = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (dto) => axios.post('/xxx', dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relevant-key'] });
      onSuccess?.();
    },
    onError: (error) => toast.error(error.message),
  });

  return { createXxx: mutation.mutate, isPending: mutation.isPending };
};
```

## Query key conventions (keep consistent with existing keys)

| Data | Key |
|---|---|
| Current user | `['me']` |
| All listings | `['listings', page, limit, search, categories]` |
| Single listing | `['listings', id]` |
| My listings | `['my-listings']` |
| Any user | `['user', id]` |

Mutations that change a listing should invalidate `['my-listings']` and `['listings']`; mutations that change the current user's data (favorite, interest) should invalidate `['me']`.

By default, failed queries retry up to 2 times except on 401/403/404 (configured globally in the `QueryClientProvider` in `App.tsx` — don't override per-hook unless there's a specific reason).
