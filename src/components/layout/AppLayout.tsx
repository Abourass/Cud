import type { ParentComponent } from "solid-js";
import { ErrorBoundary } from "~/components/ErrorBoundary";
import { MainLayout } from "./MainLayout";

export const AppLayout: ParentComponent = (props) => {
  return (
    <ErrorBoundary>
      <MainLayout>{props.children}</MainLayout>
    </ErrorBoundary>
  );
};
