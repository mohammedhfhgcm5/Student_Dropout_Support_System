// providers/ReactQueryProvider.tsx
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from "@tanstack/react-query";
import React, { ReactNode } from "react";
import { AppState } from "react-native";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Pause/resume refetching when app background/foreground changes
AppState.addEventListener("change", (state) => {
  focusManager.setFocused(state === "active");
});

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
