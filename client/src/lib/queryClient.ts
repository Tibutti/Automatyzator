import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest<T = Response>(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  
  // Jeśli T to Response, zwróć res bezpośrednio
  if (method === 'DELETE' || res.status === 204) {
    // Dla DELETE lub statusu 204 No Content zwróć null
    return null as unknown as T;
  }
  
  if (res.headers.get('content-type')?.includes('application/json')) {
    return res.json() as Promise<T>;
  }
  
  return res as unknown as T;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Funkcja do odświeżania danych przy zmianie języka
export function invalidateQueriesOnLanguageChange() {
  queryClient.invalidateQueries({ queryKey: ["/api/blog-posts/featured"] });
  queryClient.invalidateQueries({ queryKey: ["/api/templates/featured"] });
  queryClient.invalidateQueries({ queryKey: ["/api/case-studies/featured"] });
  queryClient.invalidateQueries({ queryKey: ["/api/why-us"] });
  queryClient.invalidateQueries({ queryKey: ["/api/services"] });
}
