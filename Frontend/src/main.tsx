import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { Provider } from "./components/ui/provider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const Root = () => (
  <Provider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Provider>
);

const isStrict = import.meta.env.VITE_STRICT_MODE === "true";

createRoot(document.getElementById("root")!).render(
  isStrict ? (
    <StrictMode>
      <Root />
    </StrictMode>
  ) : (
    <Root />
  )
);
