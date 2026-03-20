import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider, AppRoot } from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import App from "./App.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <AppRoot>
          <App />
        </AppRoot>
      </ConfigProvider>
    </QueryClientProvider>
  </StrictMode>,
);
