import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { AppProvider } from "~/context/AppContext";
import { AppLayout } from "~/components/layout/AppLayout";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <Router
        root={(props) => (
          <AppLayout>
            <Suspense>{props.children}</Suspense>
          </AppLayout>
        )}
      >
        <FileRoutes />
      </Router>
    </AppProvider>
  );
}
