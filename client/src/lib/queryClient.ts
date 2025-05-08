import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Przechowywanie tokenu CSRF
let csrfToken: string | null = null;

// Funkcja do pobrania aktualnego tokenu CSRF z serwera
async function getCsrfToken(): Promise<string> {
  // Jeśli mamy już token, użyj go
  if (csrfToken) {
    return csrfToken;
  }
  
  try {
    // Jeśli nie mamy tokenu, pobierz go z serwera
    const response = await fetch('/api/csrf-token', {
      credentials: 'include',
    });
    
    if (!response.ok) {
      console.error('Nie udało się pobrać tokenu CSRF');
      return '';
    }
    
    const data = await response.json();
    csrfToken = data.csrfToken;
    return csrfToken || '';
  } catch (error) {
    console.error('Błąd podczas pobierania tokenu CSRF:', error);
    return '';
  }
}

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
  // Przygotuj nagłówki
  const headers: Record<string, string> = {};
  
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  
  // Pobierz token CSRF dla żądań modyfikujących (non-GET)
  if (method !== 'GET' && 
      !url.startsWith('/api/auth/') && 
      url !== '/api/admin/login' &&
      url !== '/api/chat') {
    const token = await getCsrfToken();
    if (token) {
      headers["CSRF-Token"] = token;
    }
  }
  
  // Wykonaj żądanie
  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  // Jeśli odpowiedź zawiera nowy token CSRF, zaktualizuj go
  const newCsrfToken = res.headers.get('X-CSRF-Token');
  if (newCsrfToken) {
    csrfToken = newCsrfToken;
  }

  await throwIfResNotOk(res);
  
  // Jeśli T to Response, zwróć res bezpośrednio
  if (method === 'DELETE' || res.status === 204) {
    // Dla DELETE lub statusu 204 No Content zwróć null
    return null as unknown as T;
  }
  
  if (res.headers.get('content-type')?.includes('application/json')) {
    const jsonData = await res.json();
    
    // Jeśli odpowiedź zawiera token CSRF w ciele, zapisz go
    if (jsonData && jsonData._csrf) {
      csrfToken = jsonData._csrf;
      // Usuń token z danych, aby nie zakłócać logiki aplikacji
      delete jsonData._csrf;
    }
    
    return jsonData as T;
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
    
    // Sprawdź, czy odpowiedź zawiera nowy token CSRF w nagłówku
    const newCsrfToken = res.headers.get('X-CSRF-Token');
    if (newCsrfToken) {
      csrfToken = newCsrfToken;
    }
    
    // Parsuj odpowiedź JSON i sprawdź, czy zawiera token CSRF
    const jsonData = await res.json();
    
    // Jeśli odpowiedź zawiera token CSRF w ciele, zapisz go
    if (jsonData && jsonData._csrf) {
      csrfToken = jsonData._csrf;
      // Usuń token z danych, aby nie zakłócać logiki aplikacji
      delete jsonData._csrf;
    }
    
    return jsonData;
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
