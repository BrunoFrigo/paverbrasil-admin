import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";

// Remover badge "Made with Manus" de forma agressiva
if (typeof document !== 'undefined') {
  const removeManusBadge = () => {
    const badgeById = document.getElementById('manus-badge');
    if (badgeById) badgeById.remove();
    
    document.querySelectorAll('[id*="manus"], [class*="manus"], [data-testid="manus-badge"]').forEach((el) => {
      el.remove();
    });
    
    document.querySelectorAll('*').forEach((el) => {
      if (el.textContent?.includes('Made with Manus') && el.children.length === 0) {
        el.remove();
      }
    });
  };
  
  removeManusBadge();
  const observer = new MutationObserver(() => {
    setTimeout(removeManusBadge, 100);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  setInterval(removeManusBadge, 500);
}

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
